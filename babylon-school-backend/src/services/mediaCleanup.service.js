const mongoose = require("mongoose");
const { localFileId, deleteFromLocal } = require("./storage.service");

// The homepage uses this file directly, outside the database.
const PINNED_FILES = new Set(["babylon-school/gallery/videos/videoPlay_zx3gc8.mp4"]);

function collectLocalFiles(value, files = new Set()) {
  if (typeof value === "string") {
    const id = localFileId(value);
    if (id) files.add(id);
  } else if (Array.isArray(value)) {
    value.forEach(item => collectLocalFiles(item, files));
  } else if (value && typeof value === "object") {
    const plain = typeof value.toObject === "function" ? value.toObject() : value;
    if (Object.getPrototypeOf(plain) === Object.prototype) {
      Object.values(plain).forEach(item => collectLocalFiles(item, files));
    }
  }
  return [...files];
}

function mediaFields(schema, prefix = "") {
  const fields = [];
  schema.eachPath((name, type) => {
    const field = prefix + name;
    if (type.schema) fields.push(...mediaFields(type.schema, `${field}.`));
    else if (type.instance === "String" &&
      (/(^|\.)(image|coverImage|url|file|attachment|resumeUrl|logo|favicon|publicId)$/.test(field) || field.startsWith("pageBanners."))) fields.push(field);
  });
  return fields;
}

async function isReferenced(id) {
  const escaped = [...new Set([id, encodeURI(id)])].map(value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const pattern = new RegExp(`^(?:https?://[^/]+)?/?(?:${escaped})(?:[?#].*)?$`, process.platform === "win32" ? "i" : "");
  // All application models are loaded by the routes before requests are handled.
  const references = await Promise.all(Object.values(mongoose.models).map(async Model => {
    const fields = mediaFields(Model.schema);
    return fields.length ? Model.exists({ $or: fields.map(field => ({ [field]: pattern })) }) : null;
  }));
  return references.some(Boolean);
}

async function cleanupReplacedFiles(previous, current) {
  const retained = new Set(collectLocalFiles(current));
  for (const id of collectLocalFiles(previous)) {
    if (retained.has(id) || PINNED_FILES.has(id)) continue;
    try {
      // Keep files used by other records, settings fields or retained album media.
      if (!await isReferenced(id)) await deleteFromLocal(id);
    } catch (error) {
      // Database changes are already committed; a cleanup failure must not undo them.
      console.error("Local media cleanup failed:", id, error.message);
    }
  }
}

async function updateWithMediaCleanup(previous, save) {
  const oldFiles = collectLocalFiles(previous);
  const current = await save();
  if (current) await cleanupReplacedFiles(oldFiles, current);
  return current;
}

async function deleteWithMediaCleanup(remove) {
  const removed = await remove();
  if (removed) await cleanupReplacedFiles(removed, null);
  return removed;
}

module.exports = { collectLocalFiles, cleanupReplacedFiles, updateWithMediaCleanup, deleteWithMediaCleanup };
