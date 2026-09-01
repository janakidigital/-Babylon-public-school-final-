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
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// Public application submission
router.post("/apply", upload.single("resume"), createApplication);

// Protected admin routes (Admin only)
router.get("/", protect, authorize("admin", "superAdmin"), getApplications);
router.get("/:id", protect, authorize("admin", "superAdmin"), getSingleApplication);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteApplication);
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), updateApplicationStatus);

module.exports = router;

