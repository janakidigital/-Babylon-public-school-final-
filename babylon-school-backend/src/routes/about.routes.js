const express = require("express");

const router = express.Router();

const {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  toggleAboutStatus,
} = require("../controllers/about.controller");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get About page content
router.get("/", getAbout);


// ======================================================
// PROTECTED ROUTES (Admin only)
// ======================================================

// Create About page content
router.post("/", protect, authorize("admin", "superAdmin"), createAbout);

// Update About page content
router.put("/", protect, authorize("admin", "superAdmin"), updateAbout);

// Delete About page content
router.delete("/", protect, authorize("admin", "superAdmin"), deleteAbout);

// Activate / Deactivate About page
router.patch("/status", protect, authorize("admin", "superAdmin"), toggleAboutStatus);


module.exports = router;
