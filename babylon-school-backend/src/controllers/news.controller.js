const News = require("../models/news.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL NEWS
// GET /api/v1/news
// Public
// ======================================================
const getNews = async (req, res) => {
  try {
    const news = await News.find({
      isActive: true,
      isPublished: true,
    }).sort({
      publishedAt: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: news.length,
      data: news,
    });
  } catch (error) {
    console.error("Get news error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE NEWS
// GET /api/v1/news/:id
// Public
// ======================================================
const getSingleNews = async (req, res) => {
  try {
    const news = await News.findOne({
      _id: req.params.id,
      isActive: true,
      isPublished: true,
    });

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    res.status(200).json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Get single news error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
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
// CREATE NEWS
// POST /api/v1/news
// Protected
// ======================================================
const createNews = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      content,
      author,
      category,
      tags,
      publishedAt,
      isPublished,
      isFeatured,
      isActive,
    } = req.body;

    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/news"
      );

      imageUrl = uploadedImage.url;
    }

    // Required fields
    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and content are required",
      });
    }

    // Check duplicate slug
    const existingNews = await News.findOne({ slug });

    if (existingNews) {
      return res.status(400).json({
        success: false,
        message: "News with this slug already exists",
      });
    }

    const news = await News.create({
      title,
      slug,
      shortDescription,
      content,
      image: imageUrl,
      author,
      category,
      tags,
      publishedAt,
      isPublished,
      isFeatured,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "News created successfully",
      data: news,
    });
  } catch (error) {
    console.error("Create news error:", error);

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
        message: "News with this slug already exists",
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
// UPDATE NEWS
// PUT /api/v1/news/:id
// Protected
// ======================================================
const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    // Check duplicate slug
    if (req.body.slug && req.body.slug !== news.slug) {
      const existingNews = await News.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id },
      });

      if (existingNews) {
        return res.status(400).json({
          success: false,
          message: "News with this slug already exists",
        });
      }
    }

    const payload = {
      ...req.body,
    };

    delete payload.image;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/news"
      );

      payload.image = uploadedImage.url;
    }

    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "News updated successfully",
      data: updatedNews,
    });
  } catch (error) {
    console.error("Update news error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
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
        message: "News with this slug already exists",
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
// DELETE NEWS
// DELETE /api/v1/news/:id
// Protected
// ======================================================
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    await News.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Delete news error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
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
// TOGGLE NEWS STATUS
// PATCH /api/v1/news/:id/status
// Protected
// ======================================================
const toggleNewsStatus = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    news.isActive = !news.isActive;

    await news.save();

    res.status(200).json({
      success: true,
      message: `News ${
        news.isActive ? "activated" : "deactivated"
      } successfully`,
      data: news,
    });
  } catch (error) {
    console.error("Toggle news status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
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
// PATCH /api/v1/news/:id/featured
// Protected
// ======================================================
const toggleFeaturedStatus = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    news.isFeatured = !news.isFeatured;

    await news.save();

    res.status(200).json({
      success: true,
      message: `News ${
        news.isFeatured
          ? "marked as featured"
          : "removed from featured"
      } successfully`,
      data: news,
    });
  } catch (error) {
    console.error("Toggle featured status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
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
// PUBLISH / UNPUBLISH NEWS
// PATCH /api/v1/news/:id/publish
// Protected
// ======================================================
const togglePublishStatus = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News not found",
      });
    }

    news.isPublished = !news.isPublished;

    // Set publication date when publishing
    if (news.isPublished && !news.publishedAt) {
      news.publishedAt = new Date();
    }

    // Clear publication date when unpublished
    if (!news.isPublished) {
      news.publishedAt = null;
    }

    await news.save();

    res.status(200).json({
      success: true,
      message: `News ${
        news.isPublished ? "published" : "unpublished"
      } successfully`,
      data: news,
    });
  } catch (error) {
    console.error("Toggle publish status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid news ID",
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
  getNews,
  getSingleNews,
  createNews,
  updateNews,
  deleteNews,
  toggleNewsStatus,
  toggleFeaturedStatus,
  togglePublishStatus,
};