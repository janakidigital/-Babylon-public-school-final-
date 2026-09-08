const UPLOAD_PREFIX = "/babylon-school/";
const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

function apiOrigin(apiBase) {
  return /^https?:\/\//i.test(apiBase) ? new URL(apiBase).origin : "";
}

function localMediaPath(value, apiBase) {
  if (value.startsWith(UPLOAD_PREFIX)) return value;
  if (!/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.pathname.startsWith(UPLOAD_PREFIX) &&
        (LOOPBACK_HOSTS.has(url.hostname) || url.origin === apiOrigin(apiBase))) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    // Leave unrelated strings and malformed URLs unchanged.
  }
  return null;
}

export function resolveMediaUrl(value, apiBase = "/api/v1") {
  if (typeof value !== "string") return value;
  const localPath = localMediaPath(value, apiBase);
  return localPath ? `${apiOrigin(apiBase)}${localPath}` : value;
}

function mapStrings(value, transform) {
  if (typeof value === "string") return transform(value);
  if (Array.isArray(value)) return value.map(item => mapStrings(item, transform));
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, mapStrings(item, transform)]));
  }
  return value;
}

export function resolveMediaUrls(payload, apiBase) {
  return mapStrings(payload, value => resolveMediaUrl(value, apiBase));
}

export function normalizeUploadBody(body, apiBase) {
  const normalize = value => localMediaPath(value, apiBase) || value;
  if (!(body instanceof FormData)) return mapStrings(body, normalize);
  const result = new FormData();
  for (const [key, value] of body.entries()) {
    if (typeof value !== "string") {
      result.append(key, value);
      continue;
    }
    let normalized = normalize(value);
    // Retained gallery/ECA images and settings arrive as JSON form fields.
    if (/^\s*[\[{]/.test(value)) {
      try {
        const parsed = JSON.parse(value);
        const mapped = mapStrings(parsed, normalize);
        if (JSON.stringify(parsed) !== JSON.stringify(mapped)) normalized = JSON.stringify(mapped);
      } catch {
        // Ordinary text form fields are preserved.
      }
    }
    result.append(key, normalized);
  }
  return result;
}
