const express = require("express");

const router = express.Router();

const {
  getFaculty,
  getSingleFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  toggleFacultyStatus,
} = require("../controllers/faculty.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all active faculty
router.get("/", getFaculty);

// Get single faculty
router.get("/:id", getSingleFaculty);

// =====================================================
// PROTECTED ROUTES
// =====================================================

// Create faculty member
router.post("/", protect, upload.single("image"), createFaculty);

// Update faculty member
router.put("/:id", protect, upload.single("image"), updateFaculty);

// Delete faculty member
router.delete("/:id", protect, deleteFaculty);

// Activate / Deactivate
router.patch("/:id/status", protect, toggleFacultyStatus);

module.exports = router;

