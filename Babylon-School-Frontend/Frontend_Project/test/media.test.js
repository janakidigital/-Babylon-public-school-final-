import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeUploadBody, resolveMediaUrl, resolveMediaUrls } from "../src/services/media.js";

const photo = "/babylon-school/faculty/photo.png";

test("local paths work on the current website and on a separate API domain", () => {
  assert.equal(resolveMediaUrl(photo), photo);
  assert.equal(resolveMediaUrl(photo, "https://api.school.example/api/v1"), `https://api.school.example${photo}`);
  assert.equal(resolveMediaUrl(`http://localhost:5000${photo}`), photo);
  assert.equal(resolveMediaUrl(`http://127.0.0.1:5000${photo}`, "https://api.school.example/api/v1"), `https://api.school.example${photo}`);
});

test("API responses resolve nested media while leaving other links unchanged", () => {
  const payload = { data: { images: [{ url: photo }], resumeUrl: "/babylon-school/careers/resume.pdf", video: "https://www.youtube.com/watch?v=example", external: "https://other.example/babylon-school/photo.png", preview: "blob:preview", text: "School news" } };
  const result = resolveMediaUrls(payload, "https://api.school.example/api/v1");
  assert.equal(result.data.images[0].url, `https://api.school.example${photo}`);
  assert.equal(result.data.resumeUrl, "https://api.school.example/babylon-school/careers/resume.pdf");
  for (const key of ["video", "external", "preview", "text"]) assert.equal(result.data[key], payload.data[key]);
  assert.equal(payload.data.images[0].url, photo);
});

test("JSON updates send portable paths back to the database", () => {
  const body = { studentLife: { image: `https://api.school.example${photo}` }, images: [{ url: `http://localhost:5000${photo}` }] };
  const result = normalizeUploadBody(body, "https://api.school.example/api/v1");
  assert.equal(result.studentLife.image, photo);
  assert.equal(result.images[0].url, photo);
});

test("multipart updates normalize retained images without changing uploaded files", async () => {
  const body = new FormData();
  body.append("existingImages", JSON.stringify([{ url: `https://api.school.example${photo}`, caption: "Photo" }]));
  body.append("logo", `http://localhost:5000${photo}`);
  body.append("description", "  [School news]  ");
  body.append("image", new Blob(["image bytes"], { type: "image/png" }), "photo.png");
  body.append("image", new Blob(["second image"], { type: "image/png" }), "second.png");
  const result = normalizeUploadBody(body, "https://api.school.example/api/v1");
  assert.equal(JSON.parse(result.get("existingImages"))[0].url, photo);
  assert.equal(result.get("logo"), photo);
  assert.equal(result.get("description"), "  [School news]  ");
  assert.equal(result.getAll("image").length, 2);
  assert.equal(result.get("image").name, "photo.png");
  assert.equal(await result.get("image").text(), "image bytes");
  assert.ok(body.get("existingImages").includes("https://api.school.example"));
});
