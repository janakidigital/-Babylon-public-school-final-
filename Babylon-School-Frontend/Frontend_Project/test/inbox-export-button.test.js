import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createServer } from "vite";
import toast from "react-hot-toast";

const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
for (const name of ["window", "document", "Node", "Text", "Element", "HTMLElement", "MutationObserver", "DOMParser", "FormData"]) {
  globalThis[name] = dom.window[name];
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const { MemoryRouter } = await import("react-router-dom");
const h = React.createElement;
let vite, root, AdminPage, InboxExportButton;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true, ws: false }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  AdminPage = (await vite.ssrLoadModule("/src/admin/AdminPage.jsx")).default;
  InboxExportButton = (await vite.ssrLoadModule("/src/admin/InboxExportButton.jsx")).default;
  root = createRoot(document.getElementById("root"));
}, { timeout: 30000 });

after(async () => {
  await act(async () => root?.unmount());
  await vite?.close();
  dom.window.close();
});

const exportButton = () => document.querySelector(".admin-inbox-export");
const response = (data) => ({ ok: true, json: async () => ({ data }) });

async function finishDownload() {
  const deadline = Date.now() + 15000;
  while (exportButton().getAttribute("aria-busy") === "true" && Date.now() < deadline) {
    await act(async () => new Promise(resolve => setTimeout(resolve, 10)));
  }
  assert.equal(exportButton().getAttribute("aria-busy"), "false", "download finishes and button recovers");
}

function captureDownloads(t) {
  const downloads = [];
  const blobs = [];
  t.mock.method(URL, "createObjectURL", blob => {
    blobs.push(blob);
    return "blob:inbox-export-test";
  });
  t.mock.method(dom.window.HTMLAnchorElement.prototype, "click", function () {
    downloads.push({ filename: this.download, url: this.href });
  });
  t.after(async () => { await act(async () => root.render(null)); });
  return { downloads, blobs };
}

for (const [view, kind] of [["admissions", "admissions"], ["contacts", "contacts"], ["career-apps", "career-applications"]]) {
  test(`${view} downloads all fresh submissions in one Excel file`, async t => {
    const { downloads, blobs } = captureDownloads(t);
    const notices = [];
    t.mock.method(toast, "success", text => notices.push(text));
    const requests = [];
    let records = [{ _id: "first", name: "First applicant", email: "first@example.com" }];
    let finishFetch;
    t.mock.method(globalThis, "fetch", async (url, options = {}) => {
      if (url.endsWith("/users/profile")) return response({ name: "Admin", role: "admin" });
      requests.push({ url, options });
      if (requests.length === 2) await new Promise(resolve => { finishFetch = resolve; });
      return response(records);
    });
    await act(async () => root.render(h(MemoryRouter, { key: view, initialEntries: [`/admin/${view}`] }, h(AdminPage))));
    assert.equal(exportButton().disabled, false);
    assert.equal(exportButton().textContent, "Download all (Excel)");
    assert.match(exportButton().title, /Download all .* as an Excel file/);

    records = [...records, { _id: "second", name: "New website submission", email: "new@example.com" }];
    await act(async () => {
      exportButton().click();
      exportButton().click();
    });
    assert.equal(requests.length, 2, "duplicate clicks do not start another request");
    assert.equal(exportButton().disabled, true);
    assert.equal(exportButton().textContent, "Downloading...");
    assert.ok(requests.every(({ url, options }) => url.endsWith(`/${kind}`) && options.credentials === "include"));
    await act(async () => finishFetch());
    await finishDownload();

    assert.equal(downloads.length, 1);
    assert.match(downloads[0].filename, new RegExp(`^babylon-${kind}-\\d{4}-\\d{2}-\\d{2}\\.xlsx$`));
    assert.equal(blobs[0].type, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await blobs[0].arrayBuffer());
    assert.equal(workbook.worksheets[0].rowCount, 3, "header and both submissions are exported");
    assert.ok(workbook.worksheets[0].getRow(3).values.includes("New website submission"));
    assert.deepEqual(notices, ["Excel download started for 2 submissions."]);
    assert.equal(exportButton().disabled, false);
  });
}

test("initial loading, empty results and failed downloads recover without creating a file", async t => {
  const { downloads } = captureDownloads(t);
  const errors = [];
  t.mock.method(toast, "error", message => errors.push(message));
  let result = response([]);
  let requests = 0;
  t.mock.method(globalThis, "fetch", async () => {
    requests += 1;
    return result;
  });
  await act(async () => root.render(h(InboxExportButton, { kind: "contacts", loading: true })));
  await act(async () => exportButton().click());
  assert.equal(exportButton().disabled, true);
  assert.equal(requests, 0);

  await act(async () => root.render(h(InboxExportButton, { kind: "contacts", loading: false })));
  await act(async () => exportButton().click());
  assert.equal(requests, 1);
  assert.equal(downloads.length, 0);
  assert.equal(exportButton().disabled, false);

  result = { ok: false, json: async () => ({ message: "Your session expired" }) };
  await act(async () => exportButton().click());
  assert.deepEqual(errors, ["Your session expired"]);
  assert.equal(downloads.length, 0);
  assert.equal(exportButton().disabled, false);

  result = response({ unexpected: "shape" });
  await act(async () => exportButton().click());
  assert.equal(errors.at(-1), "Unable to read submissions. Please try again.");
  assert.equal(downloads.length, 0);
  assert.equal(exportButton().disabled, false);

  result = response([{ _id: "retry", name: "Retry succeeds" }]);
  await act(async () => exportButton().click());
  await finishDownload();
  assert.equal(downloads.length, 1, "download can be retried after errors");
  assert.equal(exportButton().disabled, false);
});
