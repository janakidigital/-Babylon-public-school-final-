const express = require("express");
const router = express.Router();

const {
  getCareers,
  getSingleCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  applyToCareer,
  toggleCareerStatus,
} = require("../controllers/career.controller");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getCareers);
router.get("/:id", getSingleCareer);

// Protected (Admin only)
router.post("/", protect, authorize("admin", "superAdmin"), createCareer);
router.put("/:id", protect, authorize("admin", "superAdmin"), updateCareer);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteCareer);
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleCareerStatus);

// Application (public) - multipart for resume upload
router.post("/:careerId/apply", upload.single("resume"), applyToCareer);

module.exports = router;

