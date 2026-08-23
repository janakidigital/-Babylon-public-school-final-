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

// Public
router.get("/", getFaqs);
router.get("/:id", getSingleFaq);

// Protected
router.post("/", protect, createFaq);
router.put("/:id", protect, updateFaq);
router.delete("/:id", protect, deleteFaq);
router.patch("/:id/status", protect, toggleFaqStatus);

module.exports = router;

