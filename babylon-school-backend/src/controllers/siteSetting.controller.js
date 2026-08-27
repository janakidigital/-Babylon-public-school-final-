const SiteSetting = require("../models/siteSetting.model");
const { uploadToCloudinary } = require("../services/storage.service");

function parseSettingsBody(req) {
  const body = { ...req.body };

  // Parse socialLinks if sent as string
  if (typeof body.socialLinks === "string") {
    try {
      body.socialLinks = JSON.parse(body.socialLinks);
    } catch {
      body.socialLinks = {};
    }
  }

  // Support flat facebook / instagram / youtube fields
  if (body.facebook || body.instagram || body.youtube) {
    body.socialLinks = {
      ...(body.socialLinks || {}),
      facebook: body.facebook || "",
      instagram: body.instagram || "",
      youtube: body.youtube || "",
    };
    delete body.facebook;
    delete body.instagram;
    delete body.youtube;
  }

  return body;
}

const getSiteSettings = async (req, res) => {
  try {
    const settings = await SiteSetting.findOne();
    res.status(200).json({
      success: true,
      data: settings || null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get site settings",
      error: error.message,
    });
  }
};

// Create site settings
const createSiteSettings = async (req, res) => {
  try {
    const existingSettings = await SiteSetting.findOne();

    if (existingSettings) {
      return res.status(400).json({
        success: false,
        message: "Site settings already exist",
      });
    }

    const payload = parseSettingsBody(req);

    // Handle logo
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/settings"
      );
      payload.logo = uploaded.url;
    }

    const settings = await SiteSetting.create(payload);

    res.status(201).json({
      success: true,
      message: "Site settings created successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create site settings",
      error: error.message,
    });
  }
};

// Update site settings
const updateSiteSettings = async (req, res) => {
  try {
    const payload = parseSettingsBody(req);

    // Handle logo upload
    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/settings"
      );
      payload.logo = uploaded.url;
    }

    let settings = await SiteSetting.findOne();

    if (!settings) {
      settings = await SiteSetting.create({
        schoolName: payload.schoolName || "Babylon National School",
        ...payload,
      });
    } else {
      settings = await SiteSetting.findByIdAndUpdate(settings._id, payload, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "Site settings saved successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update site settings",
      error: error.message,
    });
  }
};

module.exports = {
  getSiteSettings,
  createSiteSettings,
  updateSiteSettings,
};