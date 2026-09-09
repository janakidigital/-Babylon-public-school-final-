const { updateWithMediaCleanup, deleteWithMediaCleanup } = require("../services/mediaCleanup.service");
const News = require("../models/news.model");
const { uploadToLocal } = require("../services/storage.service");
const { parseCalendarDate } = require("../utils/calendarDate");

function validatePostType(value) {
  if (value !== undefined && !["news", "blog"].includes(value)) {
    const error = new Error("Post type must be News or Blog");
    error.statusCode = 400;
    throw error;
  }
  return value;
}

// ======================================================
// GET ALL NEWS
// GET /api/v1/news
// Public
// ======================================================
const getNews = async (req, res) => {
  try {
    const isAdmin = req.user && ["admin", "superAdmin"].includes(req.user.role);
    const news = await News.find(isAdmin ? {} : {
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
        message: "Post not found",
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
        message: "Invalid post ID",
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
    const postType = validatePostType(req.body.postType) || "news";
    const publicationDate = parseCalendarDate(req.body.publishedAt, "Published date");
    const {
      title,
      slug,
      shortDescription,
      content,
      author,
      category,
      tags,
      isPublished,
      isFeatured,
      isActive,
    } = req.body;

    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToLocal(req.file, "babylon-school/news");

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
        message: "Post with this slug already exists",
      });
    }

    const news = await News.create({
      title,
      postType,
      slug,
      shortDescription,
      content,
      image: imageUrl,
      author,
      category,
      tags,
      publishedAt: publicationDate || new Date(),
      isPublished: isPublished === undefined || isPublished === "" ? true : isPublished === true || isPublished === "true",
      isFeatured,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: news,
    });
  } catch (error) {
    console.error("Create news error:", error);
    if (error.statusCode === 400) {
      return res.status(400).json({ success: false, message: error.message });
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
        message: "Post with this slug already exists",
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
    validatePostType(req.body.postType);
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
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
          message: "Post with this slug already exists",
        });
      }
    }

    const payload = {
      ...req.body,
    };

    delete payload.image;
    if (req.body.publishedAt !== undefined) {
      payload.publishedAt = parseCalendarDate(req.body.publishedAt, "Published date");
    }

    if (req.file) {
      const uploadedImage = await uploadToLocal(req.file, "babylon-school/news");

      payload.image = uploadedImage.url;
    }

    const updatedNews = await updateWithMediaCleanup(news, () => News.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    ));

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: updatedNews,
    });
  } catch (error) {
    console.error("Update news error:", error);
    if (error.statusCode === 400) {
      return res.status(400).json({ success: false, message: error.message });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
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
        message: "Post with this slug already exists",
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
        message: "Post not found",
      });
    }

    await deleteWithMediaCleanup(() => News.findByIdAndDelete(req.params.id));

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete news error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
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
        message: "Post not found",
      });
    }

    news.isActive = !news.isActive;

    await news.save();

    res.status(200).json({
      success: true,
      message: `Post ${
        news.isActive ? "activated" : "deactivated"
      } successfully`,
      data: news,
    });
  } catch (error) {
    console.error("Toggle news status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
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
        message: "Post not found",
      });
    }

    news.isFeatured = !news.isFeatured;

    await news.save();

    res.status(200).json({
      success: true,
      message: `Post ${
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
        message: "Invalid post ID",
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
        message: "Post not found",
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
      message: `Post ${
        news.isPublished ? "published" : "unpublished"
      } successfully`,
      data: news,
    });
  } catch (error) {
    console.error("Toggle publish status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
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
