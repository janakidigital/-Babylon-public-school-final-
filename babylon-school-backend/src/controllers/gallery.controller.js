const Gallery = require("../models/gallery.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL GALLERY ITEMS
// GET /api/v1/gallery
// Public
// ======================================================
const getGalleryItems = async (req, res) => {
  try {
    const gallery = await Gallery.find({
      isActive: true,
    }).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    console.error("Get gallery error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE GALLERY ITEM
// GET /api/v1/gallery/:id
// Public
// ======================================================
const getGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    console.error("Get gallery item error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
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
// CREATE GALLERY ITEM
// POST /api/v1/gallery
// Protected
// ======================================================
const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      album,
      displayOrder,
      isFeatured,
      isActive,
    } = req.body;

    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/gallery"
      );

      imageUrl = uploadedImage.url;
    }

    if (!title || !req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Title and image file are required",
      });
    }

    const galleryItem = await Gallery.create({
      title,
      description,
      image: imageUrl,
      category,
      album,
      displayOrder,
      isFeatured,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Gallery item created successfully",
      data: galleryItem,
    });
  } catch (error) {
    console.error("Create gallery item error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
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
// UPDATE GALLERY ITEM
// PUT /api/v1/gallery/:id
// Protected
// ======================================================
const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    const payload = {
      ...req.body,
    };

    delete payload.image;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/gallery"
      );

      payload.image = uploadedImage.url;
    }

    const updatedGalleryItem =
      await Gallery.findByIdAndUpdate(
        req.params.id,
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Gallery item updated successfully",
      data: updatedGalleryItem,
    });
  } catch (error) {
    console.error("Update gallery item error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
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

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE GALLERY ITEM
// DELETE /api/v1/gallery/:id
// Protected
// ======================================================
const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery item error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
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
// TOGGLE GALLERY STATUS
// PATCH /api/v1/gallery/:id/status
// Protected
// ======================================================
const toggleGalleryStatus = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    galleryItem.isActive = !galleryItem.isActive;

    await galleryItem.save();

    res.status(200).json({
      success: true,
      message: `Gallery item ${
        galleryItem.isActive
          ? "activated"
          : "deactivated"
      } successfully`,
      data: galleryItem,
    });
  } catch (error) {
    console.error("Toggle gallery status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
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
// PATCH /api/v1/gallery/:id/featured
// Protected
// ======================================================
const toggleFeaturedStatus = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found",
      });
    }

    galleryItem.isFeatured = !galleryItem.isFeatured;

    await galleryItem.save();

    res.status(200).json({
      success: true,
      message: `Gallery item ${
        galleryItem.isFeatured
          ? "marked as featured"
          : "removed from featured"
      } successfully`,
      data: galleryItem,
    });
  } catch (error) {
    console.error(
      "Toggle gallery featured error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery item ID",
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
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  toggleGalleryStatus,
  toggleFeaturedStatus,
};