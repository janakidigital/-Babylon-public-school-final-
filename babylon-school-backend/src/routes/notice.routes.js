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

const { protect } = require("../middleware/auth");

// ======================================================
// PUBLIC
// ======================================================

router.get("/", getNotices);

router.get("/:id", getNotice);


// ======================================================
// PROTECTED
// ======================================================

router.post("/", protect, createNotice);

router.put("/:id", protect, updateNotice);

router.delete("/:id", protect, deleteNotice);

router.patch("/:id/status", protect, toggleNoticeStatus);

router.patch("/:id/featured", protect, toggleFeaturedStatus);

router.patch("/:id/publish", protect, togglePublishStatus);


module.exports = router;
