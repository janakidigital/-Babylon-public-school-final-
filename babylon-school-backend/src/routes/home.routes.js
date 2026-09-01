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
const authorize = require("../middleware/authorize.middleware");

// PUBLIC ROUTES
// Get homepage content
router.get("/", getHome);


// PROTECTED ROUTES (Admin only)
// Create homepage content
router.post("/", protect, authorize("admin", "superAdmin"), createHome);

// Update homepage content
router.put("/", protect, authorize("admin", "superAdmin"), updateHome);

// Delete homepage content
router.delete("/", protect, authorize("admin", "superAdmin"), deleteHome);

// Activate / Deactivate homepage
router.patch("/status", protect, authorize("admin", "superAdmin"), toggleHomeStatus);


module.exports = router;

