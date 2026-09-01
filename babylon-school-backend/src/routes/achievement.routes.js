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
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// Public
router.get("/", getAchievements);
router.get("/:id", getSingleAchievement);

// Protected (Admin only)
router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createAchievement);
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updateAchievement);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteAchievement);
router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleAchievementStatus);

module.exports = router;

