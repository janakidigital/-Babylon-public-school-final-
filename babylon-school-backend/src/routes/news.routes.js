const express = require("express");

const router = express.Router();

const {
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
  toggleFeaturedStatus,
  togglePublishStatus,
} = require("../controllers/news.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all published and active news
router.get("/", getNews);

// Get single published and active news
router.get("/:id", getSingleNews);


// ======================================================
// PROTECTED ROUTES
// ======================================================

// Create news
router.post("/", protect, upload.single("image"), createNews);

// Update news
router.put("/:id", protect, upload.single("image"), updateNews);

// Delete news
router.delete("/:id", protect, deleteNews);

// Activate / Deactivate news
router.patch("/:id/status", protect, toggleNewsStatus);

// Mark / Unmark as featured
router.patch("/:id/featured", protect, toggleFeaturedStatus);

// Publish / Unpublish news
router.patch("/:id/publish", protect, togglePublishStatus);


module.exports = router;
