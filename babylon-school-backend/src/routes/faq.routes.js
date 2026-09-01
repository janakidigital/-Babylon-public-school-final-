const express = require("express");
const router = express.Router();

const {
  getFaqs,
  getSingleFaq,
  createFaq,
  updateFaq,
  deleteFaq,
  toggleFaqStatus,
} = require("../controllers/faq.controller");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");

// Public
router.get("/", getFaqs);
router.get("/:id", getSingleFaq);

// Protected (Admin only)
router.post("/", protect, authorize("admin", "superAdmin"), createFaq);
router.put("/:id", protect, authorize("admin", "superAdmin"), updateFaq);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteFaq);
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleFaqStatus);

module.exports = router;

