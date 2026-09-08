// Preview with: node scripts/migrateLocalMedia.js
// Apply with:   node scripts/migrateLocalMedia.js --apply
require("dotenv").config({ quiet: true });
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");
const { UPLOAD_ROOT, UPLOAD_URL_PREFIX } = require("../src/services/storage.service");

function buildFileIndex(root) {
  const byName = new Map();
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile()) {
        const relativePath = path.relative(root, fullPath).split(path.sep).join("/");
        byName.set(entry.name, [...(byName.get(entry.name) || []), relativePath]);
      }
    }
  }
  visit(root);
  return byName;
}

function localPathFor(value, root, byName) {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) return null;
  let url;
  try { url = new URL(value); } catch { return null; }
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); } catch { return null; }
  const prefix = `${UPLOAD_URL_PREFIX}/`;
  const isCloudUrl = url.hostname === "res.cloudinary.com";
  const isLocalUrl = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (!isCloudUrl && !isLocalUrl) return null;
  const start = isCloudUrl ? pathname.indexOf(prefix) : pathname.startsWith(prefix) ? 0 : -1;
  let relativePath = start >= 0 ? pathname.slice(start + prefix.length) : null;
  if (!relativePath && isCloudUrl) {
    const matches = byName.get(path.posix.basename(pathname)) || [];
    if (matches.length === 1) relativePath = matches[0];
  }
  if (!relativePath || relativePath.includes("\\") || relativePath.split("/").some(part => !part || part === "." || part === "..")) return null;
  const fullPath = path.resolve(root, relativePath);
  if (!fullPath.startsWith(`${path.resolve(root)}${path.sep}`) || !fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) return null;
  return prefix + relativePath.split("/").map(encodeURIComponent).join("/");
}

function findChanges(value, convert, currentPath = "", changes = []) {
  if (typeof value === "string") {
    const replacement = convert(value);
    if (replacement && replacement !== value) changes.push({ path: currentPath, before: value, after: replacement });
  } else if (Array.isArray(value) || (value && Object.getPrototypeOf(value) === Object.prototype)) {
    for (const [key, item] of Object.entries(value)) {
      if (key === "_id" || key.includes(".") || key.startsWith("$")) continue;
      findChanges(item, convert, currentPath ? `${currentPath}.${key}` : key, changes);
    }
  }
  return changes;
}

async function main() {
  const apply = process.argv.includes("--apply");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  const index = buildFileIndex(UPLOAD_ROOT);
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
  const db = mongoose.connection.db;
  const plan = [];
  const summary = [];
  for (const { name } of await db.listCollections({}, { nameOnly: true }).toArray()) {
    if (name.startsWith("system.")) continue;
    let changedUrls = 0;
    let unmatchedCloudinaryUrls = 0;
    for await (const doc of db.collection(name).find({})) {
      const changes = findChanges(doc, value => {
        const localPath = localPathFor(value, UPLOAD_ROOT, index);
        if (!localPath && /^https?:\/\/res\.cloudinary\.com\//i.test(value)) unmatchedCloudinaryUrls++;
        return localPath;
      });
      if (changes.length) {
        plan.push({ collection: name, id: doc._id, changes });
        changedUrls += changes.length;
      }
    }
    if (changedUrls || unmatchedCloudinaryUrls) summary.push({ collection: name, changedUrls, unmatchedCloudinaryUrls });
  }
  console.log(JSON.stringify({ mode: apply ? "apply" : "preview", documents: plan.length, summary }));
  if (!apply || !plan.length) return;

  // Save original media values before changing any database records.
  const backupDirectory = path.resolve(__dirname, "../.local-media-backups");
  fs.mkdirSync(backupDirectory, { recursive: true });
  const backupFile = path.join(backupDirectory, `media-${Date.now()}.json`);
  fs.writeFileSync(backupFile, JSON.stringify(plan, null, 2), { flag: "wx" });
  let updated = 0;
  let skipped = 0;
  for (const entry of plan) {
    const filter = { _id: entry.id };
    const update = {};
    for (const change of entry.changes) {
      filter[change.path] = change.before;
      update[change.path] = change.after;
    }
    // Skip a record if someone edited any of its media fields after the preview.
    const result = await db.collection(entry.collection).updateOne(filter, { $set: update });
    if (result.modifiedCount) updated++;
    else skipped++;
  }
  console.log(JSON.stringify({ updatedDocuments: updated, skippedDocuments: skipped, backupFile }));
}

if (require.main === module) {
  const timeout = setTimeout(() => { console.error("Media migration timed out; check database connectivity."); process.exit(1); }, 60000);
  main().catch(error => {
    // Connection errors may include connection details; only print the error type.
    console.error("Media migration failed:", error.name);
    process.exitCode = 1;
  }).finally(async () => { await mongoose.disconnect(); clearTimeout(timeout); });
}

module.exports = { buildFileIndex, localPathFor, findChanges };
