const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildFileIndex, localPathFor, findChanges } = require("../scripts/migrateLocalMedia");

const root = fs.mkdtempSync(path.join(__dirname, ".migration-"));
for (const file of ["faculty/photo.png", "notices/notice.pdf", "gallery/shared.jpg", "settings/shared.jpg"]) {
  const fullPath = path.join(root, file);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, "fixture");
}
const index = buildFileIndex(root);
after(() => {
  assert.equal(path.dirname(path.resolve(root)), path.resolve(__dirname));
  assert.ok(path.basename(root).startsWith(".migration-"));
  fs.rmSync(root, { recursive: true, force: true });
});

test("migration only rewrites media whose matching file exists locally", () => {
  assert.equal(localPathFor("http://localhost:5000/babylon-school/faculty/photo.png", root, index), "/babylon-school/faculty/photo.png");
  assert.equal(localPathFor("https://res.cloudinary.com/school/image/upload/v1/babylon-school/faculty/photo.png", root, index), "/babylon-school/faculty/photo.png");
  assert.equal(localPathFor("https://res.cloudinary.com/school/image/upload/v1/notice.pdf", root, index), "/babylon-school/notices/notice.pdf");
  assert.equal(localPathFor("https://res.cloudinary.com/school/image/upload/missing.png", root, index), null);
});

test("migration preserves ambiguous filenames, unrelated URLs and relative paths", () => {
  for (const value of ["https://res.cloudinary.com/school/image/upload/shared.jpg", "https://other.example/babylon-school/faculty/photo.png", "/babylon-school/faculty/photo.png", "http://localhost:5000/babylon-school/..%5c..%5cpackage.json"]) {
    assert.equal(localPathFor(value, root, index), null);
  }
});

test("migration targets individual URL fields inside arrays without deleting data", () => {
  const url = "http://localhost:5000/babylon-school/faculty/photo.png";
  const doc = { _id: "id", title: "Keep title", images: [{ url, caption: "Keep caption" }], profileImage: { url, publicId: "keep-id" } };
  const changes = findChanges(doc, value => localPathFor(value, root, index));
  assert.deepEqual(changes, [
    { path: "images.0.url", before: url, after: "/babylon-school/faculty/photo.png" },
    { path: "profileImage.url", before: url, after: "/babylon-school/faculty/photo.png" },
  ]);
  assert.equal(doc.images[0].url, url);
});
