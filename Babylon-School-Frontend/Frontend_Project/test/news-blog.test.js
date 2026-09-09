import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import React, { act } from "react";
import { createServer } from "vite";

const dom = new JSDOM('<div id="root"></div>', { url: "http://localhost", pretendToBeVisual: true });
for (const name of ["window", "document", "Node", "Text", "Element", "HTMLElement", "MutationObserver", "DOMParser", "FormData", "CustomEvent"]) {
  globalThis[name] = dom.window[name];
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const { MemoryRouter, Routes, Route } = await import("react-router-dom");
let vite, root, AdminPage, BlogPage, BlogDetailsPage, ContentCards, publicApi, Quill;
const h = React.createElement;

before(async () => {
  vite = await createServer({ server: { middlewareMode: true, ws: false }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  AdminPage = (await vite.ssrLoadModule("/src/admin/AdminPage.jsx")).default;
  BlogPage = (await vite.ssrLoadModule("/src/pages/Blog/BlogPage.jsx")).default;
  BlogDetailsPage = (await vite.ssrLoadModule("/src/pages/Blog/BlogDetailsPage.jsx")).default;
  ContentCards = (await vite.ssrLoadModule("/src/components/shared/ContentCards.jsx")).default;
  publicApi = (await vite.ssrLoadModule("/src/services/api.js")).publicApi;
  Quill = (await import("quill")).default;
  root = createRoot(document.getElementById("root"));
}, { timeout: 30000 });

after(async () => {
  await act(async () => root?.unmount());
  await vite?.close();
  dom.window.close();
});

async function renderAt(path, element) {
  await act(async () => root.render(h(MemoryRouter, { key: path, initialEntries: [path] }, element)));
}

test("admin saves and reopens the News/Blog choice independently of the category and formatted content", async t => {
  const legacy = { _id: "legacy", title: "Legacy post", content: "Existing content", category: "School Activities" };
  const records = [legacy];
  const writes = [];
  t.mock.method(globalThis, "fetch", async (url, options = {}) => {
    let data;
    if (url.endsWith("/users/profile")) data = { name: "Admin", role: "admin" };
    else if (options.method === "POST" || options.method === "PUT") {
      const fields = Object.fromEntries(options.body);
      writes.push({ method: options.method, fields });
      data = { ...records.find(item => item._id === "saved"), ...fields, _id: "saved" };
      const index = records.findIndex(item => item._id === "saved");
      if (index < 0) records.push(data);
      else records[index] = data;
    } else data = [...records];
    return { ok: true, json: async () => ({ data }) };
  });
  await renderAt("/admin/news", h(AdminPage));
  await act(async () => [...document.querySelectorAll("button")].find(button => button.textContent.trim() === "Add News/Blog post").click());
  const select = () => document.querySelector('select[name="postType"]');
  assert.equal(select().value, "news");
  assert.deepEqual([...select().options].filter(option => option.value).map(option => [option.value, option.textContent]), [["news", "News"], ["blog", "Blog"]]);
  await act(async () => {
    select().value = "blog";
    select().dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    document.querySelector('input[name="title"]').value = "Learning together";
    document.querySelector('input[name="category"]').value = "School Activities";
    document.querySelector('input[name="publishedAt"]').value = "2026-07-16";
    const editor = Quill.find(document.querySelector(".ql-container"));
    editor.setText("A school story");
    editor.formatText(0, 1, "bold", true);
  });
  await act(async () => document.querySelector(".admin-form").requestSubmit());
  assert.equal(writes.length, 1);
  assert.equal(writes[0].method, "POST");
  assert.equal(writes[0].fields.postType, "blog");
  assert.equal(writes[0].fields.category, "School Activities");
  assert.equal(select().value, "blog");
  assert.match(document.querySelector(".admin-table").textContent, /Type: Blog/);

  await act(async () => {
    select().value = "news";
    select().dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    document.querySelector(".admin-form").requestSubmit();
  });
  assert.equal(writes[1].method, "PUT");
  assert.equal(writes[1].fields.postType, "news");
  for (const field of ["content", "category", "publishedAt"]) {
    assert.equal(writes[1].fields[field], writes[0].fields[field]);
  }
  await act(async () => [...document.querySelectorAll(".admin-table article")].find(row => row.querySelector("h3").textContent === "Legacy post").querySelector("button").click());
  assert.equal(select().value, "news");
  assert.equal(document.querySelector('input[name="category"]').value, legacy.category);
});

const posts = [
  { _id: "one", title: "July 16 blog", postType: "blog", publishedAt: "2026-07-16", category: "School Activities", content: "A blog article." },
  { _id: "two", title: "July 15 news", postType: "news", publishedAt: "2026-07-15" },
  { _id: "three", title: "July 14 blog", postType: "blog", publishedAt: "2026-07-14" },
  { _id: "four", title: "July 13 legacy news", publishedAt: "2026-07-13" },
  { _id: "five", title: "July 12 blog", postType: "blog", publishedAt: "2026-07-12" },
  { _id: "six", title: "July 11 blog", postType: "blog", publishedAt: "2026-07-11" },
];

test("public filters and pagination keep date order, classify older entries as News and reset when switching type", async t => {
  t.mock.method(publicApi, "news", async () => ({ data: posts }));
  await renderAt("/blog", h(BlogPage));
  const titles = () => [...document.querySelectorAll(".blog-featured-title, .blog-card-title")].map(title => title.textContent);
  const filter = async label => act(async () => [...document.querySelectorAll(".blog-filters button")].find(button => button.textContent === label).click());
  assert.deepEqual(titles(), posts.slice(0, 3).map(post => post.title));
  assert.equal(document.querySelector(".blog-featured-badge").textContent, "Blog · Featured");
  assert.match(document.querySelector(".blog-featured-meta").textContent, /School Activities/);
  await filter("Blog");
  assert.deepEqual(titles(), [posts[0].title, posts[2].title, posts[4].title]);
  assert.equal(document.querySelector('.blog-filters [aria-pressed="true"]').textContent, "Blog");
  await act(async () => document.querySelector(".btn-see-more").click());
  assert.deepEqual(titles(), [posts[0].title, posts[2].title, posts[4].title, posts[5].title]);
  assert.equal(document.querySelector(".btn-see-more"), null);
  await filter("News");
  assert.deepEqual(titles(), [posts[1].title, posts[3].title]);
  assert.equal(document.querySelector(".blog-card-badge").textContent, "News");
  await filter("All");
  assert.deepEqual(titles(), posts.slice(0, 3).map(post => post.title));
});

test("the homepage, detail page and shared cards show the selected post type", async t => {
  t.mock.method(publicApi, "news", async () => ({ data: posts }));
  t.mock.method(publicApi, "newsOne", async () => ({ data: posts[0] }));
  await renderAt("/", h(BlogPage));
  assert.equal(document.querySelector(".section-title").textContent, "Latest News & Blog");
  assert.deepEqual([...document.querySelectorAll(".blog-card-badge")].map(badge => badge.textContent), ["Blog", "News", "Blog"]);
  await renderAt("/blog-details/one", h(Routes, null, h(Route, { path: "/blog-details/:id", element: h(BlogDetailsPage) })));
  assert.equal(document.querySelector(".page-banner .eyebrow").textContent, "Blog · School Activities");
  assert.match(document.querySelector(".article-copy").textContent, /A blog article/);
  await renderAt("/cards", h(ContentCards, { type: "post", items: [posts[0], posts[3]] }));
  assert.deepEqual([...document.querySelectorAll(".content-cards .eyebrow")].map(label => label.textContent), ["Blog · School Activities", "News"]);
});
