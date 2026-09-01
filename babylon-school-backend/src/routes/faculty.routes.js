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
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all active faculty
router.get("/", getFaculty);

// Get single faculty
router.get("/:id", getSingleFaculty);

// =====================================================
// PROTECTED ROUTES (Admin only)
// =====================================================

// Create faculty member
router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createFaculty);

// Update faculty member
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updateFaculty);

// Delete faculty member
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteFaculty);

// Activate / Deactivate
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleFacultyStatus);

module.exports = router;

