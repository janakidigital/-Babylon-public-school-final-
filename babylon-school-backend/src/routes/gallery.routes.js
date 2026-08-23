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

// ======================================================
// PUBLIC ROUTES
// ======================================================

router.get("/", getGalleryItems);

router.get("/:id", getGalleryItem);


// ======================================================
// PROTECTED ROUTES
// ======================================================

router.post("/", protect, upload.single("image"), createGalleryItem);

router.put("/:id", protect, upload.single("image"), updateGalleryItem);

router.delete("/:id", protect, deleteGalleryItem);

router.patch(
  "/:id/status",
  protect,
  toggleGalleryStatus
);

router.patch(
  "/:id/featured",
  protect,
  toggleFeaturedStatus
);

module.exports = router;
