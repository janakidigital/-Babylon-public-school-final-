const express = require("express");

const router = express.Router();

const {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  toggleFeaturedStatus,
} = require("../controllers/testimonial.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

router.get("/", getTestimonials);

router.get("/:id", getTestimonial);


// ======================================================
// PROTECTED ROUTES
// ======================================================

router.post("/", protect, upload.single("image"), createTestimonial);

router.put("/:id", protect, upload.single("image"), updateTestimonial);

router.delete("/:id", protect, deleteTestimonial);

router.patch(
  "/:id/status",
  protect,
  toggleTestimonialStatus
);

router.patch(
  "/:id/featured",
  protect,
  toggleFeaturedStatus
);

module.exports = router;
