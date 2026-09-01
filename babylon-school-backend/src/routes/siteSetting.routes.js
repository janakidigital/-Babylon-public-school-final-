const express = require("express");

const {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
} = require("../controllers/siteSetting.controller");

const router = express.Router();
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", getSiteSettings);

router.post("/", protect, authorize("admin", "superAdmin"), upload.any(), createSiteSettings);

router.put("/", protect, authorize("admin", "superAdmin"), upload.any(), updateSiteSettings);

module.exports = router;