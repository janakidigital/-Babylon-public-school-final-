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
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

router.get("/", getTestimonials);

router.get("/:id", getTestimonial);


// ======================================================
// PROTECTED ROUTES (Admin only)
// ======================================================

router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createTestimonial);

router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updateTestimonial);

router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteTestimonial);

router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superAdmin"),
  toggleTestimonialStatus
);

router.patch(
  "/:id/featured",
  protect,
  authorize("admin", "superAdmin"),
  toggleFeaturedStatus
);

module.exports = router;
