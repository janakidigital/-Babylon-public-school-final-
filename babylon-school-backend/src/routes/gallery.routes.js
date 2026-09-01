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
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getGalleryItems);
router.get("/:id", getGalleryItem);

// Protected (Admin only)
router.post("/", protect, authorize("admin", "superAdmin"), upload.array("image", 30), createGalleryItem);
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.array("image", 30), updateGalleryItem);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteGalleryItem);
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleGalleryStatus);
router.patch("/:id/featured", protect, authorize("admin", "superAdmin"), toggleFeaturedStatus);

module.exports = router;