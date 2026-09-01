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
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getFacilities);
router.get("/:id", getSingleFacility);

// Protected (Admin only)
router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createFacility);
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updateFacility);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteFacility);
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleFacilityStatus);

module.exports = router;

