const Notice = require("../models/notice.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// ALLOWED ATTACHMENT TYPES
// ======================================================

const ALLOWED_ATTACHMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// ======================================================
// GET ATTACHMENT TYPE
// ======================================================

const getAttachmentType = (mimetype) => {
  if (mimetype === "application/pdf") {
    return "pdf";
  }

  if (mimetype.startsWith("image/")) {
    return "image";
  }

  return null;
};

// ======================================================
// GET ALL NOTICES
// ======================================================

const getNotices = async (req, res) => {
  try {
    const isAdmin =
      req.user &&
      ["admin", "superAdmin"].includes(req.user.role);

    const notices = await Notice.find(
      isAdmin
        ? {}
        : {
            isActive: true,
            isPublished: true,
          }
    ).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices,
    });
  } catch (error) {
    console.error("Get notices error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE NOTICE
// ======================================================

const getNotice = async (req, res) => {
  try {
    const notice = await Notice.findOne({
      _id: req.params.id,
      isActive: true,
      isPublished: true,
    });

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error("Get notice error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE NOTICE
// ======================================================

const createNotice = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      content,
      category,
      publishedAt,
      isPublished,
      isFeatured,
      isActive,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and content are required",
      });
    }

    // --------------------------------------------------
    // CHECK DUPLICATE SLUG
    // --------------------------------------------------

    const existingNotice = await Notice.findOne({ slug });

    if (existingNotice) {
      return res.status(400).json({
        success: false,
        message: "Notice with this slug already exists",
      });
    }

    // --------------------------------------------------
    // ATTACHMENT
    // --------------------------------------------------

    let attachmentUrl = null;
    let attachmentType = null;
    let attachmentName = null;

    // --------------------------------------------------
    // UPLOAD PDF / IMAGE
    // --------------------------------------------------

    if (req.file) {
      console.log("Uploaded file:", {
        name: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      // Validate
      if (!ALLOWED_ATTACHMENT_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attachment type. Only PDF, JPG, JPEG, PNG and WEBP files are allowed.",
        });
      }

      attachmentType = getAttachmentType(req.file.mimetype);
      attachmentName = req.file.originalname;

      // Upload
      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/notices",
        req.file.mimetype
      );

      attachmentUrl = uploadedFile.url;

      console.log("Attachment uploaded:", {
        url: attachmentUrl,
        type: attachmentType,
        name: attachmentName,
      });
    }

    // --------------------------------------------------
    // CREATE NOTICE
    // --------------------------------------------------

    const notice = await Notice.create({
      title,
      slug,
      shortDescription,
      content,
      category,

      attachment: attachmentUrl,
      attachmentType,
      attachmentName,

      publishedAt: publishedAt || new Date(),

      isPublished:
        isPublished === undefined || isPublished === ""
          ? true
          : isPublished === true ||
            isPublished === "true" ||
            isPublished === "on",

      isFeatured:
        isFeatured === true ||
        isFeatured === "true" ||
        isFeatured === "on",

      isActive:
        isActive === undefined || isActive === ""
          ? true
          : isActive === true ||
            isActive === "true" ||
            isActive === "on",
    });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice,
    });
  } catch (error) {
    console.error("Create notice error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Notice with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE NOTICE
// ======================================================

const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    // --------------------------------------------------
    // CHECK DUPLICATE SLUG
    // --------------------------------------------------

    if (
      req.body.slug &&
      req.body.slug !== notice.slug
    ) {
      const existingNotice = await Notice.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id },
      });

      if (existingNotice) {
        return res.status(400).json({
          success: false,
          message: "Notice with this slug already exists",
        });
      }
    }

    // --------------------------------------------------
    // UPDATE PAYLOAD
    // --------------------------------------------------

    const payload = { ...req.body };

    // --------------------------------------------------
    // BOOLEAN VALUES
    // --------------------------------------------------

    if (payload.isPublished !== undefined) {
      payload.isPublished =
        payload.isPublished === true ||
        payload.isPublished === "true" ||
        payload.isPublished === "on";
    }

    if (payload.isFeatured !== undefined) {
      payload.isFeatured =
        payload.isFeatured === true ||
        payload.isFeatured === "true" ||
        payload.isFeatured === "on";
    }

    if (payload.isActive !== undefined) {
      payload.isActive =
        payload.isActive === true ||
        payload.isActive === "true" ||
        payload.isActive === "on";
    }

    // --------------------------------------------------
    // NEW ATTACHMENT
    // --------------------------------------------------

    if (req.file) {
      console.log("Uploaded new attachment:", {
        name: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });

      if (!ALLOWED_ATTACHMENT_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid attachment type. Only PDF, JPG, JPEG, PNG and WEBP files are allowed.",
        });
      }

      const attachmentType = getAttachmentType(
        req.file.mimetype
      );

      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/notices",
        req.file.mimetype
      );

      payload.attachment = uploadedFile.url;
      payload.attachmentType = attachmentType;
      payload.attachmentName = req.file.originalname;

      console.log("New attachment uploaded:", {
        url: uploadedFile.url,
        type: attachmentType,
        name: req.file.originalname,
      });
    }

    // --------------------------------------------------
    // UPDATE
    // --------------------------------------------------

    const updatedNotice =
      await Notice.findByIdAndUpdate(
        req.params.id,
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: updatedNotice,
    });
  } catch (error) {
    console.error("Update notice error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Notice with this slug already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE NOTICE
// ======================================================

const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    await Notice.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (error) {
    console.error("Delete notice error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE NOTICE STATUS
// ======================================================

const toggleNoticeStatus = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    notice.isActive = !notice.isActive;

    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice ${
        notice.isActive ? "activated" : "deactivated"
      } successfully`,
      data: notice,
    });
  } catch (error) {
    console.error(
      "Toggle notice status error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE FEATURED STATUS
// ======================================================

const toggleFeaturedStatus = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    notice.isFeatured = !notice.isFeatured;

    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice ${
        notice.isFeatured
          ? "marked as featured"
          : "removed from featured"
      } successfully`,
      data: notice,
    });
  } catch (error) {
    console.error(
      "Toggle featured status error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE PUBLISH STATUS
// ======================================================

const togglePublishStatus = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    notice.isPublished = !notice.isPublished;

    if (notice.isPublished && !notice.publishedAt) {
      notice.publishedAt = new Date();
    }

    if (!notice.isPublished) {
      notice.publishedAt = null;
    }

    await notice.save();

    res.status(200).json({
      success: true,
      message: `Notice ${
        notice.isPublished
          ? "published"
          : "unpublished"
      } successfully`,
      data: notice,
    });
  } catch (error) {
    console.error(
      "Toggle publish status error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid notice ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getNotices,
  getNotice,
  createNotice,
  updateNotice,
  deleteNotice,
  toggleNoticeStatus,
  toggleFeaturedStatus,
  togglePublishStatus,
};