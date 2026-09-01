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

const { protect, optionalProtect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all published and active news
router.get("/", optionalProtect, getNews);

// Get single published and active news
router.get("/:id", getSingleNews);


// ======================================================
// PROTECTED ROUTES (Admin only)
// ======================================================

// Create news
router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createNews);

// Update news
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updateNews);

// Delete news
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteNews);

// Activate / Deactivate news
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleNewsStatus);

// Mark / Unmark as featured
router.patch("/:id/featured", protect, authorize("admin", "superAdmin"), toggleFeaturedStatus);

// Publish / Unpublish news
router.patch("/:id/publish", protect, authorize("admin", "superAdmin"), togglePublishStatus);


module.exports = router;
