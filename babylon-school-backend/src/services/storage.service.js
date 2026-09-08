const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

// Use the existing local folders, independently of the cwd.
const UPLOAD_ROOT = path.resolve(
  __dirname,
  "../../",
  process.env.LOCAL_UPLOAD_DIR || "src/babylon_image_File"
);
const UPLOAD_URL_PREFIX = "/babylon-school";
const FOLDERS = new Set([
  "achievements", "careers", "downloads", "eca", "events", "facilities",
  "faculty", "gallery", "gallery/videos", "news", "notices", "posters",
  "programs", "settings", "testimonials", "users",
]);
const IMAGE_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp", ".avif",
  ".ico", ".tif", ".tiff", ".heic", ".heif",
]);
const VIDEO_EXTENSIONS = new Set([
  ".mp4", ".mkv", ".mov", ".avi", ".wmv", ".webm", ".flv", ".m4v",
  ".3gp", ".ogv", ".mpeg", ".mpg",
]);
const DOCUMENT_EXTENSIONS = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".txt",
]);
const MIME_EXTENSIONS = {
  "image/jpeg": ".jpg", "image/png": ".png", "image/gif": ".gif",
  "image/webp": ".webp", "image/svg+xml": ".svg", "image/bmp": ".bmp",
  "image/avif": ".avif", "image/x-icon": ".ico",
  "image/vnd.microsoft.icon": ".ico", "image/tiff": ".tiff",
  "image/heic": ".heic", "image/heif": ".heif",
  "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov",
  "video/x-matroska": ".mkv", "video/x-msvideo": ".avi",
  "video/x-ms-wmv": ".wmv", "video/x-flv": ".flv", "video/x-m4v": ".m4v",
  "video/3gpp": ".3gp", "video/ogg": ".ogv", "video/mpeg": ".mpeg",
  "application/pdf": ".pdf", "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "text/plain": ".txt",
};

function getExtension(file) {
  const originalExtension = path.extname(file.originalname || "").toLowerCase();
  if (IMAGE_EXTENSIONS.has(originalExtension) || VIDEO_EXTENSIONS.has(originalExtension) || DOCUMENT_EXTENSIONS.has(originalExtension)) {
    return originalExtension;
  }
  const extension = MIME_EXTENSIONS[file.mimetype];
  if (!extension) {
    const error = new Error("Unsupported upload file type");
    error.status = 400;
    throw error;
  }
  return extension;
}

async function uploadToLocal(file, folder) {
  if (!file || !Buffer.isBuffer(file.buffer) || file.buffer.length === 0) {
    throw new Error("An uploaded file buffer is required");
  }
  const subfolder = folder.replace(/^babylon-school\//, "");
  if (!FOLDERS.has(subfolder)) {
    throw new Error("Invalid upload folder");
  }

  const extension = getExtension(file);
  const filename = `${randomUUID()}${extension}`;
  const publicId = `babylon-school/${subfolder}/${filename}`;
  // Store a portable public path; the frontend resolves the serving origin.
  const url = `/${publicId}`;
  const destination = path.join(UPLOAD_ROOT, subfolder);
  await fs.mkdir(destination, { recursive: true });
  await fs.writeFile(path.join(destination, filename), file.buffer, { flag: "wx" });

  return {
    url,
    publicId,
    resourceType: IMAGE_EXTENSIONS.has(extension) ? "image" : VIDEO_EXTENSIONS.has(extension) ? "video" : "raw",
    format: extension.slice(1),
  };
}

function localFileId(value) {
  if (typeof value !== "string") return null;
  let pathname = value;
  if (/^https?:\/\//i.test(value)) {
    let url;
    try { url = new URL(value); } catch { return null; }
    if (!["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) return null;
    // Keep the raw path until after validation so URL normalization cannot hide traversal.
    pathname = value.replace(/^https?:\/\/[^/]+/i, "");
  }
  try { pathname = decodeURIComponent(pathname.split(/[?#]/)[0]); } catch { return null; }
  if (pathname.startsWith("/")) pathname = pathname.slice(1);
  if (!pathname.startsWith("babylon-school/") || pathname.includes("\\")) return null;
  const relativePath = pathname.slice("babylon-school/".length);
  const subfolder = path.posix.dirname(relativePath);
  const filename = path.posix.basename(relativePath);
  // Include imported filenames and extensionless documents, but never directory paths.
  if (!FOLDERS.has(subfolder) || !/^[a-z0-9][a-z0-9._ -]*$/i.test(filename) || /[. ]$/.test(filename)) return null;
  return `babylon-school/${subfolder}/${filename}`;
}

async function deleteFromLocal(value) {
  const publicId = localFileId(value);
  if (!publicId) return false;
  const filePath = path.resolve(UPLOAD_ROOT, publicId.slice("babylon-school/".length));

  try {
    // A symlink or junction must not allow deletion outside the upload directory.
    const root = await fs.realpath(UPLOAD_ROOT);
    const target = await fs.realpath(filePath);
    if (!target.startsWith(`${root}${path.sep}`)) return false;
    if (!(await fs.stat(filePath)).isFile()) return false;
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

module.exports = { uploadToLocal, deleteFromLocal, localFileId, UPLOAD_ROOT, UPLOAD_URL_PREFIX };
