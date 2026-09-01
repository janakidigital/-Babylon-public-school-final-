const express = require("express");
const router = express.Router();

const {
  getDownloads,
  createDownload,
  updateDownload,
  deleteDownload,
} = require("../controllers/download.controller");

const { protect, optionalProtect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// Public routes
router.get("/", optionalProtect, getDownloads);

// Protected routes (Admin only)
router.post("/", protect, authorize("admin", "superAdmin"), upload.single("file"), createDownload);
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("file"), updateDownload);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteDownload);

module.exports = router;
