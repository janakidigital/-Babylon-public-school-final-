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

// ======================================================
// PUBLIC ROUTES
// ======================================================

// Get About page content
router.get("/", getAbout);


// ======================================================
// PROTECTED ROUTES
// ======================================================

// Create About page content
router.post("/", protect, createAbout);

// Update About page content
router.put("/", protect, updateAbout);

// Delete About page content
router.delete("/", protect, deleteAbout);

// Activate / Deactivate About page
router.patch("/status", protect, toggleAboutStatus);


module.exports = router;
