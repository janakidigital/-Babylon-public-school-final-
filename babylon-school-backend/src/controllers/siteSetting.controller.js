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

  // Support flat social links fields
  if (body.facebook !== undefined || body.instagram !== undefined || body.youtube !== undefined || body.twitter !== undefined || body.linkedin !== undefined) {
    body.socialLinks = {
      ...(body.socialLinks || {}),
      ...(body.facebook !== undefined && { facebook: body.facebook }),
      ...(body.instagram !== undefined && { instagram: body.instagram }),
      ...(body.youtube !== undefined && { youtube: body.youtube }),
      ...(body.twitter !== undefined && { twitter: body.twitter }),
      ...(body.linkedin !== undefined && { linkedin: body.linkedin }),
    };
    delete body.facebook;
    delete body.instagram;
    delete body.youtube;
    delete body.twitter;
    delete body.linkedin;
  }

  // Parse stats if sent as string
  if (typeof body.stats === "string") {
    try {
      body.stats = JSON.parse(body.stats);
    } catch {
      body.stats = {};
    }
  }

  // Support flat stats fields
  if (
    body.studentsCount !== undefined ||
    body.studentsLabel !== undefined ||
    body.teachersCount !== undefined ||
    body.teachersLabel !== undefined ||
    body.sinceValue !== undefined ||
    body.sinceLabel !== undefined
  ) {
    body.stats = {
      ...(body.stats || {}),
      ...(body.studentsCount !== undefined && { studentsCount: body.studentsCount }),
      ...(body.studentsLabel !== undefined && { studentsLabel: body.studentsLabel }),
      ...(body.teachersCount !== undefined && { teachersCount: body.teachersCount }),
      ...(body.teachersLabel !== undefined && { teachersLabel: body.teachersLabel }),
      ...(body.sinceValue !== undefined && { sinceValue: body.sinceValue }),
      ...(body.sinceLabel !== undefined && { sinceLabel: body.sinceLabel }),
    };
    delete body.studentsCount;
    delete body.studentsLabel;
    delete body.teachersCount;
    delete body.teachersLabel;
    delete body.sinceValue;
    delete body.sinceLabel;
  }

  // Parse studentLife if sent as string
  if (typeof body.studentLife === "string") {
    try {
      body.studentLife = JSON.parse(body.studentLife);
    } catch {
      body.studentLife = {};
    }
  }

  // Support flat studentLife fields
  if (
    body.studentLifeEyebrow !== undefined ||
    body.studentLifeTitle !== undefined ||
    body.studentLifeDescription !== undefined ||
    body.studentLifeHeading !== undefined ||
    body.studentLifeImage !== undefined
  ) {
    body.studentLife = {
      ...(body.studentLife || {}),
      ...(body.studentLifeEyebrow !== undefined && { eyebrow: body.studentLifeEyebrow }),
      ...(body.studentLifeTitle !== undefined && { title: body.studentLifeTitle }),
      ...(body.studentLifeDescription !== undefined && { description: body.studentLifeDescription }),
      ...(body.studentLifeHeading !== undefined && { heading: body.studentLifeHeading }),
      ...(body.studentLifeImage !== undefined && { image: body.studentLifeImage }),
    };
    delete body.studentLifeEyebrow;
    delete body.studentLifeTitle;
    delete body.studentLifeDescription;
    delete body.studentLifeHeading;
    delete body.studentLifeImage;
  }

  // Parse pageBanners if sent as string
  if (typeof body.pageBanners === "string") {
    try {
      body.pageBanners = JSON.parse(body.pageBanners);
    } catch {
      body.pageBanners = {};
    }
  }

  // Support banner_* flat keys (e.g. banner_careers -> pageBanners.careers)
  Object.keys(body).forEach((key) => {
    if (key.startsWith("banner_")) {
      const bannerKey = key.replace("banner_", "");
      body.pageBanners = {
        ...(body.pageBanners || {}),
        [bannerKey]: body[key],
      };
      delete body[key];
    }
  });

  return body;
}

// Helper to handle all incoming files
async function handleFilesUpload(req, payload) {
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    for (const file of req.files) {
      const uploaded = await uploadToCloudinary(
        file.buffer,
        "babylon-school/settings",
        file.mimetype
      );
      if (file.fieldname === "logo") {
        payload.logo = uploaded.url;
      } else if (file.fieldname === "favicon") {
        payload.favicon = uploaded.url;
      } else if (
        file.fieldname === "studentLifePhoto" ||
        file.fieldname === "studentLifeImage" ||
        file.fieldname === "studentLife[image]"
      ) {
        payload.studentLife = {
          ...(payload.studentLife || {}),
          image: uploaded.url,
        };
      } else if (file.fieldname.startsWith("banner_")) {
        const bannerKey = file.fieldname.replace("banner_", "");
        payload.pageBanners = {
          ...(payload.pageBanners || {}),
          [bannerKey]: uploaded.url,
        };
      } else if (file.fieldname.startsWith("pageBanners.")) {
        const bannerKey = file.fieldname.replace("pageBanners.", "");
        payload.pageBanners = {
          ...(payload.pageBanners || {}),
          [bannerKey]: uploaded.url,
        };
      }
    }
  } else if (req.file) {
    const uploaded = await uploadToCloudinary(
      req.file.buffer,
      "babylon-school/settings",
      req.file.mimetype
    );
    if (req.file.fieldname === "logo") {
      payload.logo = uploaded.url;
    } else if (req.file.fieldname === "favicon") {
      payload.favicon = uploaded.url;
    } else if (
      req.file.fieldname === "studentLifePhoto" ||
      req.file.fieldname === "studentLifeImage"
    ) {
      payload.studentLife = {
        ...(payload.studentLife || {}),
        image: uploaded.url,
      };
    } else if (req.file.fieldname.startsWith("banner_")) {
      const bannerKey = req.file.fieldname.replace("banner_", "");
      payload.pageBanners = {
        ...(payload.pageBanners || {}),
        [bannerKey]: uploaded.url,
      };
    }
  }
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
    await handleFilesUpload(req, payload);

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
    await handleFilesUpload(req, payload);

    let settings = await SiteSetting.findOne();

    if (!settings) {
      settings = await SiteSetting.create({
        schoolName: payload.schoolName || "Babylon National School",
        ...payload,
      });
    } else {
      // Merge nested objects properly
      const mergedPayload = { ...payload };
      if (payload.stats) {
        mergedPayload.stats = {
          ...(settings.stats?.toObject ? settings.stats.toObject() : settings.stats || {}),
          ...payload.stats,
        };
      }
      if (payload.studentLife) {
        mergedPayload.studentLife = {
          ...(settings.studentLife?.toObject ? settings.studentLife.toObject() : settings.studentLife || {}),
          ...payload.studentLife,
        };
      }
      if (payload.pageBanners) {
        mergedPayload.pageBanners = {
          ...(settings.pageBanners?.toObject ? settings.pageBanners.toObject() : settings.pageBanners || {}),
          ...payload.pageBanners,
        };
      }
      if (payload.socialLinks) {
        mergedPayload.socialLinks = {
          ...(settings.socialLinks?.toObject ? settings.socialLinks.toObject() : settings.socialLinks || {}),
          ...payload.socialLinks,
        };
      }

      settings = await SiteSetting.findByIdAndUpdate(settings._id, mergedPayload, {
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