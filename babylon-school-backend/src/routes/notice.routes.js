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
const authorize = require("../middleware/authorize.middleware");

// Correct path to your upload middleware
const upload = require("../middleware/upload.middleware");

// ======================================================
// PUBLIC
// ======================================================
router.get("/", optionalProtect, getNotices);
router.get("/:id", getNotice);

// ======================================================
// PROTECTED (with PDF / file upload support - Admin only)
// ======================================================
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  upload.single("attachment"),   // field name must be "attachment"
  createNotice
);

router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  upload.single("attachment"),
  updateNotice
);

router.delete("/:id", protect, authorize("admin", "superAdmin"), deleteNotice);

router.patch("/:id/status", protect, authorize("admin", "superAdmin"), toggleNoticeStatus);
router.patch("/:id/featured", protect, authorize("admin", "superAdmin"), toggleFeaturedStatus);
router.patch("/:id/publish", protect, authorize("admin", "superAdmin"), togglePublishStatus);

module.exports = router;