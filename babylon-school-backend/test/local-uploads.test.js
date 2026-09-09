const { test, before, beforeEach, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { once } = require("node:events");
const jwt = require("jsonwebtoken");

const testRoot = fs.mkdtempSync(path.join(__dirname, ".storage-"));
process.env.LOCAL_UPLOAD_DIR = testRoot;
process.env.JWT_SECRET = "local-upload-test-secret";
const { uploadToLocal, deleteFromLocal, UPLOAD_ROOT } = require("../src/services/storage.service");
const app = require("../src/app");
const mongoose = require("mongoose");
const { cleanupReplacedFiles } = require("../src/services/mediaCleanup.service");
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aRZcAAAAASUVORK5CYII=", "base64");
const pdf = Buffer.from("%PDF-1.4\n1 0 obj<</Type/Catalog>>endobj\n%%EOF\n");
const video = Buffer.from("00000000ftypisom-test-video-bytes");
const cookie = `token=${jwt.sign({ id: "507f1f77bcf86cd799439011", role: "admin" }, process.env.JWT_SECRET)}`;
const fields = { title: "Test upload", slug: "test-upload", content: "Content", description: "Description", name: "Test person", message: "Test message", eventDate: "2026-09-08" };
let server;
let origin;

beforeEach(t => {
  // Database writes are mocked below; no other record references these test files.
  for (const Model of Object.values(mongoose.models)) t.mock.method(Model, "exists", async () => null);
});

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await once(server, "listening");
  origin = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
  // Only remove the unique temporary directory created by this test file.
  assert.equal(path.dirname(path.resolve(testRoot)), path.resolve(__dirname));
  assert.ok(path.basename(testRoot).startsWith(".storage-"));
  fs.rmSync(testRoot, { recursive: true, force: true });
});

async function submit(endpoint, method, data, files, authenticated = true) {
  const body = new FormData();
  for (const [key, value] of Object.entries(data)) body.append(key, value);
  for (const file of files) body.append(file.field || "image", new Blob([file.bytes || png], { type: file.type || "image/png" }), file.name || "photo.PNG");
  const response = await fetch(`${origin}/api/v1/${endpoint}`, { method, headers: authenticated ? { Cookie: cookie } : {}, body });
  return { status: response.status, body: await response.json() };
}

async function verifyFile(url, folder, extension, bytes = png) {
  assert.ok(url.startsWith(`/babylon-school/${folder}/`), url);
  assert.ok(url.endsWith(extension), url);
  const diskPath = path.join(UPLOAD_ROOT, folder, path.posix.basename(new URL(url, origin).pathname));
  assert.deepEqual(fs.readFileSync(diskPath), bytes);
  const response = await fetch(new URL(url, origin));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
  return response.headers.get("content-type");
}

function mockWrites(t, modelName) {
  const Model = require(`../src/models/${modelName}.model`);
  const writes = [];
  let saved = { images: [], videos: [] };
  t.mock.method(Model, "findOne", async () => null);
  t.mock.method(Model, "findById", async () => structuredClone(saved));
  t.mock.method(Model, "create", async payload => { writes.push(payload); saved = { ...payload }; return saved; });
  t.mock.method(Model, "findByIdAndUpdate", async (id, payload) => { writes.push(payload); saved = { ...saved, ...payload }; return saved; });
  t.mock.method(Model, "findByIdAndDelete", async () => { const removed = saved; saved = null; return removed; });
  return writes;
}

for (const [model, route, folder] of [
  ["achievement", "achievements", "achievements"],
  ["event", "events", "events"],
  ["faculty", "faculty", "faculty"],
  ["facility", "facility", "facilities"],
  ["news", "news", "news"],
  ["poster", "posters", "posters"],
  ["program", "programs", "programs"],
  ["testimonial", "testimonials", "testimonials"],
]) {
  test(`${route}: create and replace photos save local URLs to the model`, async t => {
    const writes = mockWrites(t, model);
    const created = await submit(route, "POST", fields, [{}]);
    assert.equal(created.status, 201, JSON.stringify(created.body));
    assert.equal(created.body.data.image, writes[0].image);
    assert.match(await verifyFile(writes[0].image, folder, ".png"), /^image\/png/);
    const updated = await submit(`${route}/test-id`, "PUT", fields, [{}]);
    assert.equal(updated.status, 200, JSON.stringify(updated.body));
    assert.equal(updated.body.data.image, writes[1].image);
    assert.notEqual(writes[0].image, writes[1].image);
    await verifyFile(writes[1].image, folder, ".png");
    assert.equal((await fetch(new URL(writes[0].image, origin))).status, 404);
    const deleted = await fetch(`${origin}/api/v1/${route}/test-id`, { method: "DELETE", headers: { Cookie: cookie } });
    assert.equal(deleted.status, 200);
    assert.equal((await fetch(new URL(writes[1].image, origin))).status, 404);
  });
}

for (const [model, route, field, savedField] of [
  ["download", "downloads", "file", "file"],
  ["notice", "notices", "attachment", "attachment"],
]) {
  test(`${route}: create and replace PDFs retain their extension and URL`, async t => {
    const writes = mockWrites(t, model);
    for (const method of ["POST", "PUT"]) {
      const result = await submit(route + (method === "PUT" ? "/test-id" : ""), method, fields, [{ field, name: "notice.pdf", type: "application/pdf", bytes: pdf }]);
      assert.equal(result.status, method === "POST" ? 201 : 200, JSON.stringify(result.body));
      const saved = writes.at(-1);
      assert.equal(result.body.data[savedField], saved[savedField]);
      assert.match(await verifyFile(saved[savedField], route, ".pdf", pdf), /^application\/pdf/);
      if (model === "notice") {
        assert.equal(saved.attachmentName, "notice.pdf");
        assert.equal(saved.attachmentType, "pdf");
      }
    }
    assert.equal((await fetch(new URL(writes[0][savedField], origin))).status, 404);
    const deleted = await fetch(`${origin}/api/v1/${route}/test-id`, { method: "DELETE", headers: { Cookie: cookie } });
    assert.equal(deleted.status, 200);
    assert.equal((await fetch(new URL(writes[1][savedField], origin))).status, 404);
  });
}

test("downloads: document dates persist through upload, edit and file replacement", async t => {
  const writes = mockWrites(t, "download");
  const Download = require("../src/models/download.model");
  const file = { field: "file", name: "document.pdf", type: "application/pdf", bytes: pdf };
  const created = await submit("downloads", "POST", { ...fields, documentDate: "2024-02-29" }, [file]);
  assert.equal(created.status, 201);
  assert.equal(created.body.data.documentDate, "2024-02-29T00:00:00.000Z");
  const record = new Download(writes[0]);
  await record.validate();
  assert.equal(record.toJSON().documentDate.toISOString(), created.body.data.documentDate);

  const updated = await submit("downloads/test-id", "PUT", { documentDate: "2026-09-09" }, []);
  assert.equal(updated.status, 200);
  assert.equal(updated.body.data.documentDate, "2026-09-09T00:00:00.000Z");
  assert.equal(updated.body.data.file, created.body.data.file);
  await verifyFile(updated.body.data.file, "downloads", ".pdf", pdf);

  const replaced = await submit("downloads/test-id", "PUT", { title: "Replacement" }, [file]);
  assert.equal(replaced.status, 200);
  assert.equal(replaced.body.data.documentDate, updated.body.data.documentDate);
  assert.notEqual(replaced.body.data.file, created.body.data.file);

  const cleared = await submit("downloads/test-id", "PUT", { documentDate: "" }, []);
  assert.equal(cleared.status, 200);
  assert.equal(cleared.body.data.documentDate, null);
  assert.equal(cleared.body.data.file, replaced.body.data.file);
});

test("downloads: invalid document dates are rejected before saving files or records", async t => {
  const writes = mockWrites(t, "download");
  const folder = path.join(UPLOAD_ROOT, "downloads");
  const existingFiles = fs.existsSync(folder) ? fs.readdirSync(folder) : [];
  for (const documentDate of ["2025-02-29", "2026-04-31", "2026-13-01", "not-a-date"]) {
    for (const method of ["POST", "PUT"]) {
      const result = await submit(`downloads${method === "PUT" ? "/test-id" : ""}`, method,
        { ...fields, documentDate }, [{ field: "file", name: "invalid.pdf", type: "application/pdf", bytes: pdf }]);
      assert.equal(result.status, 400, JSON.stringify(result.body));
      assert.match(result.body.message, /Document date/);
    }
  }
  assert.equal(writes.length, 0);
  assert.deepEqual(fs.existsSync(folder) ? fs.readdirSync(folder) : [], existingFiles);
});

function mockContentDateWrites(t, modelName) {
  if (modelName !== "eca") return mockWrites(t, modelName);
  const ECA = require("../src/models/eca.model");
  const writes = [];
  let saved = new ECA({ title: "Existing activity" });
  t.mock.method(ECA.prototype, "save", async function () {
    await this.validate();
    saved = this;
    writes.push(this.toObject());
    return this;
  });
  t.mock.method(ECA, "findById", async () => saved);
  return writes;
}

for (const [model, route, dateField, fileField] of [
  ["news", "news", "publishedAt", "image"],
  ["event", "events", "eventDate", "image"],
  ["notice", "notices", "publishedAt", "attachment"],
  ["gallery", "gallery", "albumDate", "image"],
  ["eca", "eca", "activityDate", "image"],
]) {
  test(`${route}: selected dates survive uploads, public reads, edits and media replacement`, async t => {
    const writes = mockContentDateWrites(t, model);
    const Model = require(`../src/models/${model}.model`);
    const created = await submit(route, "POST", { ...fields, [dateField]: "2024-02-29" }, [{ field: fileField }]);
    assert.equal(created.status, 201, JSON.stringify(created.body));
    assert.equal(created.body.data[dateField], "2024-02-29T00:00:00.000Z");
    const record = new Model(writes[0]);
    await record.validate();
    assert.equal(record[dateField].toISOString(), created.body.data[dateField]);

    t.mock.method(Model, "find", () => ({ sort: async () => [record] }));
    const response = await fetch(`${origin}/api/v1/${route}`);
    assert.equal(response.status, 200);
    assert.equal((await response.json()).data[0][dateField], created.body.data[dateField]);

    const edited = await submit(`${route}/test-id`, "PUT", { [dateField]: "2026-09-09" }, []);
    assert.equal(edited.status, 200, JSON.stringify(edited.body));
    assert.equal(edited.body.data[dateField], "2026-09-09T00:00:00.000Z");
    for (const field of ["image", "file", "attachment", "images", "videos"]) {
      const mediaUrls = value => Array.isArray(value) ? value.map(item => item.url) : value;
      assert.deepEqual(mediaUrls(edited.body.data[field]), mediaUrls(created.body.data[field]));
    }

    const replaced = await submit(`${route}/test-id`, "PUT", { title: "Updated content" }, [{ field: fileField }]);
    assert.equal(replaced.status, 200, JSON.stringify(replaced.body));
    assert.equal(replaced.body.data[dateField], edited.body.data[dateField]);

    const cleared = await submit(`${route}/test-id`, "PUT", { [dateField]: "" }, []);
    assert.equal(cleared.status, model === "event" ? 400 : 200, JSON.stringify(cleared.body));
    if (model === "event") assert.match(cleared.body.message, /Event date is required/);
    else assert.equal(cleared.body.data[dateField], null);
  });

  test(`${route}: invalid dates reject the request before saving media or content`, async t => {
    const writes = mockContentDateWrites(t, model);
    t.mock.method(console, "error", () => {});
    const folder = path.join(UPLOAD_ROOT, route);
    const beforeFiles = fs.existsSync(folder) ? fs.readdirSync(folder) : [];
    for (const date of ["2025-02-29", "2026-02-30", "2026-13-01", "invalid"]) {
      for (const method of ["POST", "PUT"]) {
        const result = await submit(route + (method === "PUT" ? "/test-id" : ""), method,
          { ...fields, [dateField]: date }, [{ field: fileField }]);
        assert.equal(result.status, 400, JSON.stringify(result.body));
        assert.match(result.body.message, /date must be a valid date/);
      }
    }
    assert.equal(writes.length, 0);
    assert.deepEqual(fs.existsSync(folder) ? fs.readdirSync(folder) : [], beforeFiles);
  });
}

test("news/blog: type persists through uploads, public reads and edits without changing the date or category", async t => {
  const writes = mockWrites(t, "news");
  const News = require("../src/models/news.model");
  const created = await submit("news", "POST", {
    ...fields, postType: "blog", category: "School Activities", publishedAt: "2026-07-16",
  }, [{}]);
  assert.equal(created.status, 201, JSON.stringify(created.body));
  const record = new News(writes[0]);
  await record.validate();
  assert.equal(record.postType, "blog");
  assert.equal(record.category, "School Activities");

  t.mock.method(News, "find", filter => ({ sort: async order => {
    assert.deepEqual(filter, { isActive: true, isPublished: true });
    assert.deepEqual(order, { publishedAt: -1, createdAt: -1 });
    return [record];
  } }));
  t.mock.method(News, "findOne", async () => record);
  const listing = await fetch(`${origin}/api/v1/news`);
  assert.equal((await listing.json()).data[0].postType, "blog");
  const detail = await fetch(`${origin}/api/v1/news/${record._id}`);
  assert.equal((await detail.json()).data.postType, "blog");

  const edited = await submit("news/test-id", "PUT", { title: "Edited blog" }, []);
  assert.equal(edited.status, 200, JSON.stringify(edited.body));
  assert.equal(edited.body.data.postType, "blog");
  for (const postType of ["news", "blog"]) {
    const changed = await submit("news/test-id", "PUT", { postType }, []);
    assert.equal(changed.status, 200, JSON.stringify(changed.body));
    assert.equal(changed.body.data.postType, postType);
    for (const field of ["category", "publishedAt", "content", "image"]) {
      assert.equal(changed.body.data[field], created.body.data[field]);
    }
  }
});

test("news/blog: older records and requests without a type default to News", async t => {
  mockWrites(t, "news");
  const News = require("../src/models/news.model");
  const created = await submit("news", "POST", fields, []);
  assert.equal(created.status, 201, JSON.stringify(created.body));
  assert.equal(created.body.data.postType, "news");
  const legacy = News.hydrate({ ...fields, category: "Blog" });
  assert.equal(legacy.toJSON().postType, "news");
  assert.equal(legacy.category, "Blog");
});

test("news/blog: invalid types are rejected before storing content or uploaded images", async t => {
  const writes = mockWrites(t, "news");
  const News = require("../src/models/news.model");
  t.mock.method(console, "error", () => {});
  const folder = path.join(UPLOAD_ROOT, "news");
  const beforeFiles = fs.existsSync(folder) ? fs.readdirSync(folder) : [];
  for (const postType of ["", "other", "Blog", "news,blog"]) {
    await assert.rejects(new News({ ...fields, postType }).validate(), { name: "ValidationError" });
    for (const method of ["POST", "PUT"]) {
      const result = await submit(`news${method === "PUT" ? "/test-id" : ""}`, method, { ...fields, postType }, [{}]);
      assert.equal(result.status, 400, JSON.stringify(result.body));
      assert.match(result.body.message, /Post type must be News or Blog/);
    }
  }
  assert.equal(writes.length, 0);
  assert.deepEqual(fs.existsSync(folder) ? fs.readdirSync(folder) : [], beforeFiles);
});

test("events: creating an event requires a date", async t => {
  const writes = mockWrites(t, "event");
  t.mock.method(console, "error", () => {});
  const { eventDate, ...withoutDate } = fields;
  const result = await submit("events", "POST", withoutDate, [{}]);
  assert.equal(result.status, 400);
  assert.match(result.body.message, /Event date is required/);
  assert.equal(writes.length, 0);
});

test("both public career application routes save local resume URLs", async t => {
  const writes = mockWrites(t, "careerApplication");
  mockWrites(t, "career");
  for (const endpoint of ["career-applications/apply", "careers/test-id/apply"]) {
    const result = await submit(endpoint, "POST", { ...fields, careerTitle: "Teacher" }, [{ field: "resume", name: "resume.pdf", type: "application/pdf", bytes: pdf }], false);
    assert.equal(result.status, 201, JSON.stringify(result.body));
    assert.equal(result.body.data.resumeUrl, writes.at(-1).resumeUrl);
    await verifyFile(writes.at(-1).resumeUrl, "careers", ".pdf", pdf);
  }
});

test("gallery creates photo/video albums and updates both media types", async t => {
  const writes = mockWrites(t, "gallery");
  const photos = await submit("gallery", "POST", { title: "Photos", type: "Photos" }, [{}, {}]);
  assert.equal(photos.status, 201, JSON.stringify(photos.body));
  assert.equal(writes[0].images.length, 2);
  assert.notEqual(writes[0].images[0].url, writes[0].images[1].url);
  for (const image of writes[0].images) await verifyFile(image.url, "gallery", ".png");
  const movie = { name: "movie.mp4", type: "video/mp4", bytes: video };
  const videos = await submit("gallery", "POST", { title: "Videos", type: "Videos" }, [movie]);
  assert.equal(videos.status, 201, JSON.stringify(videos.body));
  const videoUrl = writes[1].videos[0].url;
  assert.match(await verifyFile(videoUrl, "gallery/videos", ".mp4", video), /^video\/mp4/);
  const range = await fetch(new URL(videoUrl, origin), { headers: { Range: "bytes=0-7" } });
  assert.equal(range.status, 206);
  assert.deepEqual(Buffer.from(await range.arrayBuffer()), video.subarray(0, 8));
  const updated = await submit("gallery/test-id", "PUT", { title: "Updated" }, [{}, movie]);
  assert.equal(updated.status, 200, JSON.stringify(updated.body));
  await verifyFile(writes[2].images[0].url, "gallery", ".png");
  await verifyFile(writes[2].videos[0].url, "gallery/videos", ".mp4", video);
});

test("ECA multiple images are saved locally on create and update", async t => {
  const ECA = require("../src/models/eca.model");
  let saved;
  t.mock.method(ECA.prototype, "save", async function () { saved = this; return this; });
  t.mock.method(ECA, "findById", async () => saved);
  for (const method of ["POST", "PUT"]) {
    const result = await submit("eca" + (method === "PUT" ? "/test-id" : ""), method, { title: "Sports" }, [{}, {}]);
    assert.equal(result.status, method === "POST" ? 201 : 200, JSON.stringify(result.body));
    assert.equal(saved.images.length, 2);
    assert.equal(saved.coverImage, saved.images[0].url);
    for (const image of saved.images) await verifyFile(image.url, "eca", ".png");
  }
});

test("settings store logo, favicon, student life and banner file URLs", async t => {
  const writes = mockWrites(t, "siteSetting");
  for (const method of ["POST", "PUT"]) {
    const result = await submit("settings", method, { schoolName: "Babylon" }, [
      { field: "logo" }, { field: "favicon" }, { field: "studentLifePhoto" },
      { field: "banner_careers" }, { field: "pageBanners.about" },
    ]);
    assert.equal(result.status, method === "POST" ? 201 : 200, JSON.stringify(result.body));
    const saved = writes.at(-1);
    for (const url of [saved.logo, saved.favicon, saved.studentLife.image, saved.pageBanners.careers, saved.pageBanners.about]) await verifyFile(url, "settings", ".png");
  }
});

test("profile replacement and deletion clean up local files, including legacy profiles", async t => {
  const User = require("../src/models/user.model");
  const user = { profileImage: { url: "https://res.cloudinary.com/example/old.jpg", publicId: "babylon/users/old" }, save: async () => {} };
  t.mock.method(User, "findById", async () => user);
  const first = await submit("users/profile/image", "PUT", {}, [{}]);
  assert.equal(first.status, 200, JSON.stringify(first.body));
  const previous = { ...user.profileImage };
  await verifyFile(previous.url, "users", ".png");
  const second = await submit("users/profile/image", "PUT", {}, [{}]);
  assert.equal(second.status, 200, JSON.stringify(second.body));
  assert.equal((await fetch(new URL(previous.url, origin))).status, 404);
  const current = { ...user.profileImage };
  await verifyFile(current.url, "users", ".png");
  const response = await fetch(`${origin}/api/v1/users/profile/image`, { method: "DELETE", headers: { Cookie: cookie } });
  assert.equal(response.status, 200);
  assert.deepEqual(user.profileImage, { url: null, publicId: null });
  assert.equal((await fetch(new URL(current.url, origin))).status, 404);
});

test("failed profile save retains the old file and removes the new file", async t => {
  const User = require("../src/models/user.model");
  const req = { protocol: "http", get: () => new URL(origin).host };
  const oldImage = await uploadToLocal({ buffer: png, originalname: "old.png" }, "babylon-school/users", req);
  const beforeFiles = fs.readdirSync(path.join(UPLOAD_ROOT, "users"));
  t.mock.method(User, "findById", async () => ({ profileImage: oldImage, save: async () => { throw new Error("Test database failure"); } }));
  t.mock.method(console, "error", () => {});
  const response = await submit("users/profile/image", "PUT", {}, [{}]);
  assert.equal(response.status, 500);
  assert.deepEqual(fs.readdirSync(path.join(UPLOAD_ROOT, "users")), beforeFiles);
  await verifyFile(oldImage.url, "users", ".png");
});

test("storage rejects traversal and saves portable paths for supported formats", async () => {
  const req = { protocol: "http", get: () => new URL(origin).host };
  const file = { buffer: png, originalname: "../../photo.png", mimetype: "image/png" };
  await assert.rejects(uploadToLocal(file, "babylon-school/../../outside", req), /Invalid upload folder/);
  assert.equal(await deleteFromLocal("babylon-school/../server.js"), false);
  assert.equal(await deleteFromLocal("babylon-school/gallery/old-cloudinary-id"), false);
  const formats = [["image.webp", "image/webp"], ["image.avif", "image/avif"], ["resume.docx", "application/octet-stream"], ["sheet.xlsx", "application/octet-stream"]];
  for (const [originalname, mimetype] of formats) {
    const result = await uploadToLocal({ buffer: png, originalname, mimetype }, "babylon-school/downloads", req);
    await verifyFile(result.url, "downloads", path.extname(originalname));
  }
  const extensionless = await uploadToLocal({ buffer: pdf, originalname: "notice", mimetype: "application/pdf" }, "babylon-school/notices", req);
  await verifyFile(extensionless.url, "notices", ".pdf", pdf);
  const result = await uploadToLocal(file, "babylon-school/gallery");
  assert.equal(result.url, `/${result.publicId}`);
  assert.ok(!result.publicId.includes(".."));
  assert.equal(await deleteFromLocal(result.publicId), true);
  assert.equal(await deleteFromLocal(result.publicId), false);
  assert.equal((await fetch(`${origin}/babylon-school/%2e%2e%2fpackage.json`)).status, 404);
});

test("gallery removes selected photos/videos, retains others, and clears its final cover", async t => {
  const writes = mockWrites(t, "gallery");
  const movie = { name: "movie.mp4", type: "video/mp4", bytes: video };
  await submit("gallery", "POST", { title: "Album", type: "Photos" }, [{}, {}]);
  const [removedPhoto, retainedPhoto] = writes[0].images;
  await submit("gallery/test-id", "PUT", {}, [movie]);
  const removedVideo = writes[1].videos[0];
  const result = await submit("gallery/test-id", "PUT", {
    existingImages: JSON.stringify([retainedPhoto]), existingVideos: "[]",
  }, []);
  assert.equal(result.status, 200, JSON.stringify(result.body));
  assert.equal(result.body.data.coverImage, retainedPhoto.url);
  assert.equal((await fetch(new URL(removedPhoto.url, origin))).status, 404);
  assert.equal((await fetch(new URL(removedVideo.url, origin))).status, 404);
  await verifyFile(retainedPhoto.url, "gallery", ".png");
  const cleared = await submit("gallery/test-id", "PUT", { existingImages: "[]", existingVideos: "[]" }, []);
  assert.equal(cleared.status, 200);
  assert.equal(cleared.body.data.coverImage, "");
  assert.equal((await fetch(new URL(retainedPhoto.url, origin))).status, 404);
});

test("ECA removes deselected images and clears the cover when all images are removed", async t => {
  const ECA = require("../src/models/eca.model");
  let saved;
  t.mock.method(ECA.prototype, "save", async function () { saved = this; return this; });
  t.mock.method(ECA, "findById", async () => saved);
  await submit("eca", "POST", { title: "Sports" }, [{}, {}]);
  const oldUrls = saved.images.map(image => image.url);
  const updated = await submit("eca/test-id", "PUT", { existingImages: JSON.stringify([{ url: oldUrls[1] }]) }, []);
  assert.equal(updated.status, 200, JSON.stringify(updated.body));
  assert.equal((await fetch(new URL(oldUrls[0], origin))).status, 404);
  await verifyFile(oldUrls[1], "eca", ".png");
  const cleared = await submit("eca/test-id", "PUT", { existingImages: "[]" }, []);
  assert.equal(cleared.status, 200);
  assert.equal(cleared.body.data.coverImage, "");
  assert.equal((await fetch(new URL(oldUrls[1], origin))).status, 404);
});

test("settings replace their media while preserving images shared by unchanged fields", async t => {
  const Settings = require("../src/models/siteSetting.model");
  const old = await uploadToLocal({ buffer: png, originalname: "old.png" }, "babylon-school/settings");
  const studentLife = await uploadToLocal({ buffer: png, originalname: "life.png" }, "babylon-school/settings");
  let saved = { _id: "settings", schoolName: "School", logo: old.url, pageBanners: { about: old.url }, studentLife: { image: studentLife.url } };
  t.mock.method(Settings, "findOne", async () => structuredClone(saved));
  t.mock.method(Settings, "findByIdAndUpdate", async (id, payload) => { saved = { ...saved, ...payload }; return saved; });
  const changed = await submit("settings", "PUT", {}, [{ field: "logo" }, { field: "studentLifePhoto" }]);
  assert.equal(changed.status, 200, JSON.stringify(changed.body));
  await verifyFile(old.url, "settings", ".png");
  assert.equal((await fetch(new URL(studentLife.url, origin))).status, 404);
  const updated = await submit("settings", "PUT", {}, [{ field: "banner_about" }]);
  assert.equal(updated.status, 200);
  assert.equal((await fetch(new URL(old.url, origin))).status, 404);
  await verifyFile(saved.logo, "settings", ".png");
  await verifyFile(saved.pageBanners.about, "settings", ".png");
});

test("an image referenced by another record is kept until its last reference is removed", async t => {
  mockWrites(t, "faculty");
  const created = await submit("faculty", "POST", { name: "Teacher" }, [{}]);
  const oldUrl = created.body.data.image;
  const Settings = require("../src/models/siteSetting.model");
  const reference = t.mock.method(Settings, "exists", async query => {
    return query.$or.some(condition => condition["pageBanners.about"]?.test(oldUrl)) ? { _id: "settings" } : null;
  });
  const updated = await submit("faculty/test-id", "PUT", { name: "Teacher" }, [{}]);
  assert.equal(updated.status, 200);
  await verifyFile(oldUrl, "faculty", ".png");
  reference.mock.mockImplementation(async () => null);
  await cleanupReplacedFiles({ pageBanners: { about: oldUrl } }, { pageBanners: { about: "" } });
  assert.equal((await fetch(new URL(oldUrl, origin))).status, 404);
});

test("failed updates and metadata-only changes keep the old media", async t => {
  const writes = mockWrites(t, "faculty");
  await submit("faculty", "POST", { name: "Teacher" }, [{}]);
  const oldUrl = writes[0].image;
  const metadataOnly = await submit("faculty/test-id", "PUT", { name: "Updated name" }, []);
  assert.equal(metadataOnly.status, 200);
  await verifyFile(oldUrl, "faculty", ".png");
  const Faculty = require("../src/models/faculty.model");
  t.mock.method(Faculty, "findByIdAndUpdate", async () => { throw new Error("Test database failure"); });
  t.mock.method(console, "error", () => {});
  const failed = await submit("faculty/test-id", "PUT", {}, [{}]);
  assert.equal(failed.status, 500);
  await verifyFile(oldUrl, "faculty", ".png");
});

test("replacement deletes imported filenames and old localhost paths", async t => {
  const filename = "file_old_photo.jpg";
  fs.mkdirSync(path.join(UPLOAD_ROOT, "faculty"), { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_ROOT, "faculty", filename), png);
  const Faculty = require("../src/models/faculty.model");
  t.mock.method(Faculty, "findById", async () => ({ image: `http://localhost:5000/babylon-school/faculty/${filename}` }));
  t.mock.method(Faculty, "findByIdAndUpdate", async (id, payload) => payload);
  const result = await submit("faculty/test-id", "PUT", {}, [{}]);
  assert.equal(result.status, 200, JSON.stringify(result.body));
  assert.equal(fs.existsSync(path.join(UPLOAD_ROOT, "faculty", filename)), false);
  await verifyFile(result.body.data.image, "faculty", ".png");
});

test("unsafe paths, external URLs and the homepage video cannot be cleaned up", async () => {
  const imported = path.join(UPLOAD_ROOT, "notices", "imported_pdf_without_extension");
  fs.mkdirSync(path.dirname(imported), { recursive: true });
  fs.writeFileSync(imported, pdf);
  assert.equal(await deleteFromLocal("/babylon-school/notices/imported_pdf_without_extension"), true);
  const image = await uploadToLocal({ buffer: png, originalname: "photo.png" }, "babylon-school/faculty");
  const filename = path.posix.basename(image.url);
  for (const value of [`https://external.example${image.url}`, `/babylon-school/gallery/../faculty/${filename}`, `/babylon-school/gallery/%2e%2e/faculty/${filename}`, `/babylon-school/faculty/${filename}:stream`]) {
    assert.equal(await deleteFromLocal(value), false);
  }
  await verifyFile(image.url, "faculty", ".png");
  const hero = path.join(UPLOAD_ROOT, "gallery/videos/videoPlay_zx3gc8.mp4");
  fs.mkdirSync(path.dirname(hero), { recursive: true });
  fs.writeFileSync(hero, video);
  await cleanupReplacedFiles({ videos: [{ url: "/babylon-school/gallery/videos/videoPlay_zx3gc8.mp4" }] }, {});
  assert.equal(fs.existsSync(hero), true);
});
