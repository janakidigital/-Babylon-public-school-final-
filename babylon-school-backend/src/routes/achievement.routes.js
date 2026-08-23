const express = require("express");
const router = express.Router();

const {
  getAchievements,
  getSingleAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleAchievementStatus,
} = require("../controllers/achievement.controller");

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getAchievements);
router.get("/:id", getSingleAchievement);

// Protected
router.post("/", protect, upload.single("image"), createAchievement);
router.put("/:id", protect, upload.single("image"), updateAchievement);
router.delete("/:id", protect, deleteAchievement);
router.patch("/:id/status", protect, toggleAchievementStatus);

module.exports = router;

