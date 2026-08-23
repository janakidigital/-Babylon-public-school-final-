const express = require("express");
const router = express.Router();

const {
  getFacilities,
  getSingleFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  toggleFacilityStatus,
} = require("../controllers/facility.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getFacilities);
router.get("/:id", getSingleFacility);

// Protected
router.post("/", protect, upload.single("image"), createFacility);
router.put("/:id", protect, upload.single("image"), updateFacility);
router.delete("/:id", protect, deleteFacility);
router.patch("/:id/status", protect, toggleFacilityStatus);

module.exports = router;

