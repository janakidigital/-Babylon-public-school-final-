const express = require("express");
const router = express.Router();

const {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeStatus,
  toggleFeaturedStatus,
  togglePublishStatus,
} = require("../controllers/notice.controller");

const { protect, optionalProtect } = require("../middleware/auth");

// Correct path to your upload middleware
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC
// ======================================================
router.get("/", optionalProtect, getNotices);
router.get("/:id", getNotice);

// ======================================================
// PROTECTED (with PDF / file upload support)
// ======================================================
router.post(
  "/",
  protect,
  upload.single("attachment"),   // field name must be "attachment"
  createNotice
);

router.put(
  "/:id",
  protect,
  upload.single("attachment"),
  updateNotice
);

router.delete("/:id", protect, deleteNotice);

router.patch("/:id/status", protect, toggleNoticeStatus);
router.patch("/:id/featured", protect, toggleFeaturedStatus);
router.patch("/:id/publish", protect, togglePublishStatus);

module.exports = router;