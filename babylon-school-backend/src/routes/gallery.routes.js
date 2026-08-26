const express = require("express");
const router = express.Router();

const {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryStatus,
  toggleFeaturedStatus,
} = require("../controllers/gallery.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItem);

// Protected
router.post("/", protect, upload.array("image", 30), createGalleryItem);
router.put("/:id", protect, upload.array("image", 30), updateGalleryItem);
router.delete("/:id", protect, deleteGalleryItem);
router.patch("/:id/status", protect, toggleGalleryStatus);
router.patch("/:id/featured", protect, toggleFeaturedStatus);

module.exports = router;