const express = require("express");

const {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
} = require("../controllers/siteSetting.controller");

const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

router.get("/", getSiteSettings);

router.post("/", protect, upload.any(), createSiteSettings);

router.put("/", protect, upload.any(), updateSiteSettings);

module.exports = router;