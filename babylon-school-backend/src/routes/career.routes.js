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
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getCareers);
router.get("/:id", getSingleCareer);

// Protected (admin)
router.post("/", protect, createCareer);
router.put("/:id", protect, updateCareer);
router.delete("/:id", protect, deleteCareer);
router.patch("/:id/status", protect, toggleCareerStatus);

// Application (public) - multipart for resume upload
router.post("/:careerId/apply", upload.single("resume"), applyToCareer);

module.exports = router;

