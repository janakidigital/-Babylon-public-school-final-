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
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get all active programs
router.get("/", getPrograms);

// Get single active program
router.get("/:id", getProgram);


// ======================================================
// PROTECTED ROUTES (Admin only)
// ======================================================

// Create program
router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createProgram);

// Update program
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updateProgram);

// Delete program
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteProgram);

// Activate / Deactivate program
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleProgramStatus);

// Mark / Unmark as featured
router.patch("/:id/featured", protect, authorize("admin", "superAdmin"), toggleFeaturedStatus);


module.exports = router;
