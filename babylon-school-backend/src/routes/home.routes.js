const express = require("express");

const router = express.Router();

const {
  getHome,
  createHome,
  updateHome,
  deleteHome,
  toggleHomeStatus,
} = require("../controllers/home.controller");

const { protect } = require("../middleware/auth");

// PUBLIC ROUTES
// Get homepage content
router.get("/", getHome);


// PROTECTED ROUTES
// Create homepage content
router.post("/", protect, createHome);

// Update homepage content
router.put("/", protect, updateHome);

// Delete homepage content
router.delete("/", protect, deleteHome);

// Activate / Deactivate homepage
router.patch("/status", protect, toggleHomeStatus);


module.exports = router;

