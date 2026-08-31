const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB – needed for videos
  },
  fileFilter: (req, file, cb) => {
    // Allow both images and videos (check mimetype and common extensions)
    const isImage =
      file.mimetype.startsWith("image/") ||
      /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i.test(file.originalname);
    const isVideo =
      file.mimetype.startsWith("video/") ||
      /\.(mp4|mkv|mov|avi|wmv|webm|flv|m4v|3gp|ogv)$/i.test(file.originalname);
    const isDoc =
      file.mimetype === "application/pdf" ||
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i.test(file.originalname);

    if (isImage || isVideo || isDoc) {
      cb(null, true);
    } else {
      cb(new Error("Only image, video, and document files are allowed"), false);
    }
  },
});

module.exports = upload;