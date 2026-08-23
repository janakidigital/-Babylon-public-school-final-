const express = require("express");
const router = express.Router();

const {
  createApplication,
  getApplications,
  getSingleApplication,
  deleteApplication,
  updateApplicationStatus,
} = require("../controllers/careerApplication.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// Public application submission
router.post("/apply", upload.single("resume"), createApplication);

// Protected admin routes
router.get("/", protect, getApplications);
router.get("/:id", protect, getSingleApplication);
router.delete("/:id", protect, deleteApplication);
router.patch("/:id/status", protect, updateApplicationStatus);

module.exports = router;

