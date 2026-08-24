import { assetPath } from "../data/content";

export function mediaUrl(src, fallback = "") {
  if (!src) return fallback;
  if (
    /^https?:\/\//i.test(src) ||
    src.startsWith("data:") ||
    src.startsWith("/")
  )
    return src;
  return `${assetPath}${src}`;
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
