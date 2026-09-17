import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { isRichText, sanitizeRichText, serializeRichText, richTextToPlainText, firstContentLink } from "../src/lib/richText.js";

const dom = new JSDOM("");
globalThis.window = dom.window;
globalThis.document = dom.window.document;

test("existing descriptions preserve line breaks, literal markup and special characters", () => {
  const text = "School & students\n5 < 10\nUse <strong> literally";
  assert.equal(isRichText(text), false);
  assert.equal(richTextToPlainText(text), text);
});

test("formatted descriptions retain headings, lists, emphasis, alignment and links", () => {
  const value = serializeRichText('<h2 class="ql-align-center">Title</h2><p><strong>Bold</strong> &amp; <em>italic</em></p><ul><li>One</li><li>Two</li></ul><p><a href="https://school.example/notice">Notice</a></p>');
  assert.equal(isRichText(value), true);
  assert.match(value, /ql-align-center/);
  assert.match(value, /<ul><li>One<\/li><li>Two<\/li><\/ul>/);
  assert.equal(richTextToPlainText(value), "Title\nBold & italic\nOne\nTwo\nNotice");
  assert.equal(firstContentLink(value), "https://school.example/notice");
});

test("unsafe HTML, styles, external images and executable links are removed", () => {
  const clean = sanitizeRichText('<p onclick="alert(1)" style="position:fixed" class="admin-form ql-align-right">Safe</p><script>alert(1)</script><img src="https://tracker.example/pixel" onerror="alert(1)"><iframe src="https://evil.example"></iframe><a href="javascript:alert(1)" target="opener">Bad link</a><svg onload="alert(1)"></svg>');
  assert.doesNotMatch(clean, /onclick|onerror|onload|script|iframe|<img|<svg|style=|javascript:|admin-form|target=/);
  assert.match(clean, /class="ql-align-right"/);
  assert.match(clean, /Safe/);
});

test("HTML entities are decoded for previews without becoming executable markup", () => {
  const value = serializeRichText('<p>&lt;img src=x onerror=alert(1)&gt; &amp; text</p>');
  assert.equal(richTextToPlainText(value), "<img src=x onerror=alert(1)> & text");
  assert.doesNotMatch(value, /<img/);
});

test("existing and newly saved rich text use breakable spaces from every nonbreaking-space encoding", () => {
  const paragraph = "This is to inform you that the Mid-Terminal Assessment 2083 will commence soon.";
  for (const space of ["&nbsp;", "&#160;", "&#xA0;", "\u00a0"]) {
    const html = `<p>${paragraph.replaceAll(" ", space)}</p>`;
    const stored = `<div data-rich-text="true">${html}</div>`;
    for (const clean of [sanitizeRichText(stored), serializeRichText(html)]) {
      const container = document.createElement("div");
      container.innerHTML = clean;
      assert.equal(container.textContent, paragraph, `Space encoding: ${JSON.stringify(space)}`);
      assert.doesNotMatch(clean, /&nbsp;|\u00a0/);
    }
  }
});

test("space normalization preserves link attributes and escaped literal entities", () => {
  const clean = sanitizeRichText('<p><a href="https://school.example/?label=Grade&nbsp;One">Grade&nbsp;One</a> &amp;nbsp; &amp;#160; &lt;img src=x onerror=alert(1)&gt;</p>');
  const container = document.createElement("div");
  container.innerHTML = clean;
  assert.equal(container.querySelector("a").getAttribute("href"), "https://school.example/?label=Grade\u00a0One");
  assert.equal(container.textContent, "Grade One &nbsp; &#160; <img src=x onerror=alert(1)>");
  assert.equal(container.querySelector("img"), null);
});

test("download links work for both older text and formatted descriptions", () => {
  assert.equal(firstContentLink("Download https://school.example/file.pdf here"), "https://school.example/file.pdf");
  assert.equal(firstContentLink(serializeRichText('<p><a href="https://school.example/file.pdf">Download</a></p>')), "https://school.example/file.pdf");
  assert.equal(firstContentLink(serializeRichText('<a href="javascript:alert(1)">Bad</a>')), null);
});
