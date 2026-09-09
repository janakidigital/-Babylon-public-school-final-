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
let vite, Editor, RichText, Quill, root;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  Editor = (await vite.ssrLoadModule("/src/admin/RichTextEditor.jsx")).default;
  RichText = (await vite.ssrLoadModule("/src/components/shared/RichText.jsx")).default;
  Quill = (await import("quill")).default;
  root = createRoot(document.getElementById("root"));
}, { timeout: 30000 });

after(async () => {
  await act(async () => root?.unmount());
  await vite?.close();
  dom.window.close();
});

test("toolbar formatting saves in FormData and survives reopening in the editor and public view", async () => {
  await act(async () => root.render(React.createElement("form", null,
    React.createElement(Editor, { key: "first", name: "description", label: "Description", defaultValue: "School achievement", required: true }))));
  const quill = Quill.find(document.querySelector(".ql-container"));
  await act(async () => {
    quill.setSelection(0, 6, "silent");
    document.querySelector(".ql-bold").click();
    quill.formatText(7, 11, "link", "https://school.example/achievement", "user");
    quill.formatLine(0, 1, "align", "center", "user");
  });
  const saved = new dom.window.FormData(document.querySelector("form")).get("description");
  assert.match(saved, /<strong>School<\/strong>/);
  assert.match(saved, /ql-align-center/);
  assert.match(saved, /href="https:\/\/school.example\/achievement"/);

  await act(async () => root.render(React.createElement("form", null,
    React.createElement(Editor, { key: "reopened", name: "description", label: "Description", defaultValue: saved, required: true }))));
  const reopened = Quill.find(document.querySelector(".ql-container"));
  assert.equal(reopened.getText().trim(), "School achievement");
  assert.equal(reopened.getFormat(0, 6).bold, true);
  assert.equal(reopened.getFormat(0, 1).align, "center");

  await act(async () => root.render(React.createElement(RichText, { value: saved })));
  assert.equal(document.querySelector(".rich-text strong").textContent, "School");
  assert.equal(document.querySelector(".rich-text a").getAttribute("href"), "https://school.example/achievement");
});

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
