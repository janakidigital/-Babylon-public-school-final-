import createDOMPurify from "dompurify";

const MARKER = '<div data-rich-text="true">';
let purifier;

export function isRichText(value) {
  return typeof value === "string" && value.startsWith(MARKER);
}

export function sanitizeRichText(html) {
  if (!purifier) {
    purifier = createDOMPurify(window);
    purifier.addHook("uponSanitizeAttribute", (_node, data) => {
      if (data.attrName === "class") {
        data.attrValue = data.attrValue.split(/\s+/)
          .filter(name => /^ql-(align-(center|right|justify)|indent-[1-8])$/.test(name)).join(" ");
      }
      if (data.attrName === "href" && !/^(https?:|mailto:|tel:|\/(?!\/)|#)/i.test(data.attrValue.trim())) {
        data.keepAttr = false;
      }
      if (data.attrName === "data-rich-text" && data.attrValue !== "true") data.keepAttr = false;
    });
    purifier.addHook("afterSanitizeAttributes", node => {
      if (node.tagName === "A") {
        node.setAttribute("rel", "noopener noreferrer");
        if (node.getAttribute("target") !== "_blank") node.removeAttribute("target");
      }
    });
  }
  return purifier.sanitize(String(html || ""), {
    ALLOWED_TAGS: ["div", "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "blockquote", "ol", "ul", "li", "a", "span", "sub", "sup"],
    ALLOWED_ATTR: ["href", "target", "rel", "class", "data-rich-text"],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
  });
}

export function serializeRichText(html) {
  return `${MARKER}${sanitizeRichText(html)}</div>`;
}

export function richTextToPlainText(value) {
  if (!isRichText(value)) return String(value || "");
  const container = document.createElement("div");
  container.innerHTML = sanitizeRichText(value);
  container.querySelectorAll("br").forEach(node => node.replaceWith("\n"));
  container.querySelectorAll("p,h2,h3,h4,li,blockquote,div").forEach(node => node.append("\n"));
  return container.textContent.replace(/\u00a0/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function firstContentLink(value) {
  if (isRichText(value)) {
    const container = document.createElement("div");
    container.innerHTML = sanitizeRichText(value);
    const link = container.querySelector('a[href^="https://"], a[href^="http://"]');
    if (link) return link.getAttribute("href");
  }
  return richTextToPlainText(value).match(/https?:\/\/[^\s<>]+/)?.[0] || null;
}
