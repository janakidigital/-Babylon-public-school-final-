import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createServer } from "vite";

const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
for (const name of ["window", "document", "Node", "Text", "Element", "HTMLElement", "MutationObserver", "DOMParser", "getComputedStyle"]) {
  globalThis[name] = name === "getComputedStyle" ? dom.window.getComputedStyle.bind(dom.window) : dom.window[name];
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const rect = { top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 };
dom.window.Range.prototype.getBoundingClientRect = () => rect;
dom.window.Range.prototype.getClientRects = () => [];
let vite, Editor, RichText, TestimonialsSection, publicApi, Quill, root;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true, ws: false }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  Editor = (await vite.ssrLoadModule("/src/admin/RichTextEditor.jsx")).default;
  RichText = (await vite.ssrLoadModule("/src/components/shared/RichText.jsx")).default;
  TestimonialsSection = (await vite.ssrLoadModule("/src/components/home/TestimonialsSection.jsx")).default;
  publicApi = (await vite.ssrLoadModule("/src/services/api.js")).publicApi;
  Quill = (await import("quill")).default;
  root = createRoot(document.getElementById("root"));
}, { timeout: 30000 });

after(async () => {
  await act(async () => root?.unmount());
  await vite?.close();
  dom.window.close();
});

for (const [name, label] of [["description", "Description"], ["message", "Testimonial"]]) {
test(`${label} toolbar formatting saves in FormData and survives reopening in the editor and public view`, async () => {
  await act(async () => root.render(React.createElement("form", null,
    React.createElement(Editor, { key: "first", name, label, defaultValue: "School achievement", required: true }))));
  const quill = Quill.find(document.querySelector(".ql-container"));
  await act(async () => {
    quill.setSelection(0, 6, "silent");
    document.querySelector(".ql-bold").click();
    quill.formatText(7, 11, "link", "https://school.example/achievement", "user");
    quill.formatLine(0, 1, "align", "center", "user");
  });
  const saved = new dom.window.FormData(document.querySelector("form")).get(name);
  assert.match(saved, /<strong>School<\/strong>/);
  assert.match(saved, /ql-align-center/);
  assert.match(saved, /href="https:\/\/school.example\/achievement"/);

  await act(async () => root.render(React.createElement("form", null,
    React.createElement(Editor, { key: "reopened", name, label, defaultValue: saved, required: true }))));
  const reopened = Quill.find(document.querySelector(".ql-container"));
  assert.equal(reopened.getText().trim(), "School achievement");
  assert.equal(reopened.getFormat(0, 6).bold, true);
  assert.equal(reopened.getFormat(0, 1).align, "center");

  await act(async () => root.render(React.createElement(RichText, { value: saved })));
  assert.equal(document.querySelector(".rich-text strong").textContent, "School");
  assert.equal(document.querySelector(".rich-text a").getAttribute("href"), "https://school.example/achievement");
});
}

test("list formatting, undo, redo and empty-content validation work without submitting toolbar buttons", async () => {
  await act(async () => root.render(React.createElement("form", null,
    React.createElement(Editor, { key: "list", name: "description", label: "Description", defaultValue: "One\nTwo", required: true }))));
  const quill = Quill.find(document.querySelector(".ql-container"));
  await act(async () => {
    quill.setSelection(0, 7, "silent");
    document.querySelector('.ql-list[value="bullet"]').click();
  });
  assert.match(document.querySelector('textarea[name="description"]').value, /<ul>/);
  assert.ok([...document.querySelectorAll("button")].every(button => button.type === "button"));
  await act(async () => document.querySelector(".admin-rich-history button").click());
  assert.doesNotMatch(document.querySelector('textarea[name="description"]').value, /<ul>/);
  await act(async () => document.querySelector(".admin-rich-history button:last-child").click());
  assert.match(document.querySelector('textarea[name="description"]').value, /<ul>/);
  await act(async () => quill.setText("   \n"));
  await act(async () => assert.equal(document.querySelector("form").checkValidity(), false));
  assert.match(document.querySelector('[role="alert"]').textContent, /Please enter description/);
});

test("long testimonials expand with formatting, pause the slideshow and reset when changing slides", async (t) => {
  const legacyMessage = "Our child enjoys learning at school. ".repeat(12) + "\nThank you to the teachers.";
  t.mock.method(publicApi, "testimonials", async () => ({ data: [
    { name: "First parent", message: `<div data-rich-text="true"><p><strong>Wonderful teachers.</strong> ${"Our child feels supported and happy at school. ".repeat(10)}</p><ul><li>Thank you!</li></ul></div>` },
    { name: "Second parent", message: '<div data-rich-text="true"><p><strong>A welcoming school.</strong></p></div>' },
    { name: "Third parent", message: legacyMessage },
  ] }));
  const intervals = new Map();
  const originalSetInterval = globalThis.setInterval;
  const originalClearInterval = globalThis.clearInterval;
  t.mock.method(globalThis, "setInterval", (callback, delay, ...args) => {
    if (delay !== 4000) return originalSetInterval(callback, delay, ...args);
    const handle = {};
    intervals.set(handle, callback);
    return handle;
  });
  t.mock.method(globalThis, "clearInterval", handle => {
    if (!intervals.delete(handle)) originalClearInterval(handle);
  });
  t.after(async () => { await act(async () => root.render(null)); });
  await act(async () => root.render(React.createElement(TestimonialsSection)));

  const message = () => document.querySelector(".testimonial-message");
  const toggle = () => document.querySelector(".testimonial-toggle");
  assert.equal(toggle().textContent, "See more");
  assert.equal(toggle().getAttribute("aria-expanded"), "false");
  assert.equal(toggle().getAttribute("aria-controls"), message().id);
  assert.ok(message().textContent.length <= 281);
  assert.match(message().textContent, /…$/);
  assert.doesNotMatch(message().textContent, /<[^>]+>/);
  assert.equal(intervals.size, 1);

  await act(async () => toggle().click());
  assert.equal(toggle().textContent, "See less");
  assert.equal(toggle().getAttribute("aria-expanded"), "true");
  assert.equal(message().querySelector("strong").textContent, "Wonderful teachers.");
  assert.equal(message().querySelector("li").textContent, "Thank you!");
  assert.equal(intervals.size, 0);

  await act(async () => toggle().click());
  assert.match(message().textContent, /…$/);
  assert.equal(intervals.size, 1);
  await act(async () => toggle().click());
  await act(async () => document.querySelector('[aria-label="Next testimonial"]').click());
  assert.equal(document.querySelector(".testimonial-name").textContent, "Second parent");
  assert.equal(toggle(), null);
  assert.equal(message().querySelector("strong").textContent, "A welcoming school.");
  assert.equal(intervals.size, 1);

  // Automatic navigation resumes, and old plain-text testimonials still expand.
  await act(async () => [...intervals.values()][0]());
  assert.equal(document.querySelector(".testimonial-name").textContent, "Third parent");
  assert.equal(toggle().textContent, "See more");
  await act(async () => toggle().click());
  assert.equal(message().textContent, legacyMessage);
  await act(async () => document.querySelector('[aria-label="Next testimonial"]').click());
  assert.equal(document.querySelector(".testimonial-name").textContent, "First parent");
  assert.equal(toggle().textContent, "See more");
  assert.match(message().textContent, /…$/);
});
