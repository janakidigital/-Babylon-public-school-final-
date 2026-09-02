const express = require("express");
const router = express.Router();

const {
  getEcaItems,
  getEcaItem,
  createEcaItem,
  updateEcaItem,
  deleteEcaItem,
  toggleEcaStatus,
} = require("../controllers/eca.controller");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

// Public routes
router.get("/", getEcaItems);
router.get("/:id", getEcaItem);

// Protected routes (Admin / SuperAdmin only)
// upload.array("image", 40) supports uploading up to 40 images per ECA entry
router.post(
  "/",
  protect,
  authorize("admin", "superAdmin"),
  upload.array("image", 40),
  createEcaItem
);

router.put(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  upload.array("image", 40),
  updateEcaItem
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  deleteEcaItem
);

router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superAdmin"),
  toggleEcaStatus
);

module.exports = router;
