const express = require("express");

const {
    getSiteSettings,
    createSiteSettings,
    updateSiteSettings
} = require("../controllers/siteSetting.controller");

const router = express.Router();

router.get("/", getSiteSettings);

router.post("/", createSiteSettings);

router.put("/", updateSiteSettings);

module.exports = router;
