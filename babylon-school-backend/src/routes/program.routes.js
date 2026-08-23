const express = require("express");

const router = express.Router();

const {
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  toggleProgramStatus,
  toggleFeaturedStatus,
} = require("../controllers/program.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all active programs
router.get("/", getPrograms);

// Get single active program
router.get("/:id", getProgram);


// ======================================================
// PROTECTED ROUTES
// ======================================================

// Create program
router.post("/", protect, upload.single("image"), createProgram);

// Update program
router.put("/:id", protect, upload.single("image"), updateProgram);

// Delete program
router.delete("/:id", protect, deleteProgram);

// Activate / Deactivate program
router.patch("/:id/status", protect, toggleProgramStatus);

// Mark / Unmark as featured
router.patch("/:id/featured", protect, toggleFeaturedStatus);


module.exports = router;
