const express = require("express");

const router = express.Router();

const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  toggleFeaturedStatus,
} = require("../controllers/event.controller");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

router.get("/", getEvents);

router.get("/:id", getEvent);


// ======================================================
// PROTECTED ROUTES (Admin only)
// ======================================================

router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createEvent);

router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updateEvent);

router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteEvent);

router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleEventStatus);

router.patch("/:id/featured", protect, authorize("admin", "superAdmin"), toggleFeaturedStatus);


module.exports = router;
