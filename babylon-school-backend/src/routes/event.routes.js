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
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC ROUTES
// ======================================================

router.get("/", getEvents);

router.get("/:id", getEvent);


// ======================================================
// PROTECTED ROUTES
// ======================================================

router.post("/", protect, upload.single("image"), createEvent);

router.put("/:id", protect, upload.single("image"), updateEvent);

router.delete("/:id", protect, deleteEvent);

router.patch("/:id/status", protect, toggleEventStatus);

router.patch("/:id/featured", protect, toggleFeaturedStatus);


module.exports = router;
