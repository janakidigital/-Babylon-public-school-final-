const Notice = require("../models/notice.model");

// ======================================================
// GET ALL NOTICES
// GET /api/v1/notices
// Public
// ======================================================
const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({
      isActive: true,
      isPublished: true,
    }).sort({
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
// GET /api/v1/notices/:id
// Public
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
// POST /api/v1/notices
// Protected
// ======================================================
const createNotice = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      content,
      category,
      attachment,
      publishedAt,
      isPublished,
      isFeatured,
      isActive,
    } = req.body;

    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and content are required",
      });
    }

    const existingNotice = await Notice.findOne({ slug });

    if (existingNotice) {
      return res.status(400).json({
        success: false,
        message: "Notice with this slug already exists",
      });
    }

    const notice = await Notice.create({
      title,
      slug,
      shortDescription,
      content,
      category,
      attachment,
      publishedAt,
      isPublished,
      isFeatured,
      isActive,
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
// PUT /api/v1/notices/:id
// Protected
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

    if (req.body.slug && req.body.slug !== notice.slug) {
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

    const updatedNotice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
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
// DELETE /api/v1/notices/:id
// Protected
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
// PATCH /api/v1/notices/:id/status
// Protected
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
    console.error("Toggle notice status error:", error);

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
// PATCH /api/v1/notices/:id/featured
// Protected
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
    console.error("Toggle featured status error:", error);

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
// PUBLISH / UNPUBLISH NOTICE
// PATCH /api/v1/notices/:id/publish
// Protected
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
        notice.isPublished ? "published" : "unpublished"
      } successfully`,
      data: notice,
    });
  } catch (error) {
    console.error("Toggle publish status error:", error);

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