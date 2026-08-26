const express = require("express");
const router = express.Router();

const {
  getDownloads,
  createDownload,
  updateDownload,
  deleteDownload,
} = require("../controllers/download.controller");

const { protect, optionalProtect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// Public routes
router.get("/", optionalProtect, getDownloads);

// Protected routes
router.post("/", protect, upload.single("file"), createDownload);
router.put("/:id", protect, upload.single("file"), updateDownload);
router.delete("/:id", protect, deleteDownload);

module.exports = router;
