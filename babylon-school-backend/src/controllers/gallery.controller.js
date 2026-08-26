const Gallery = require("../models/gallery.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL ALBUMS
// ======================================================
const getGalleryItems = async (req, res) => {
  try {
    const gallery = await Gallery.find({ isActive: true }).sort({
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
// GET SINGLE ALBUM
// ======================================================
const getGalleryItem = async (req, res) => {
  try {
    const album = await Gallery.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    res.status(200).json({
      success: true,
      data: album,
    });
  } catch (error) {
    console.error("Get gallery item error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid album ID",
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
// CREATE ALBUM (with multiple images)
// ======================================================
const createGalleryItem = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      displayOrder,
      isFeatured,
      isActive,
    } = req.body;

    const files = req.files || [];

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Album title is required",
      });
    }

    if (files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image",
      });
    }

    // Upload all images to Cloudinary
    const uploaded = await Promise.all(
      files.map((file) =>
        uploadToCloudinary(file.buffer, "babylon-school/gallery")
      )
    );

    const images = uploaded.map((img) => ({
      url: img.url,
      caption: "",
    }));

    const album = await Gallery.create({
      title,
      description,
      coverImage: images[0]?.url || "",
      images,
      category,
      displayOrder: displayOrder || 0,
      isFeatured: isFeatured === true || isFeatured === "true",
      isActive:
        isActive === undefined || isActive === ""
          ? true
          : isActive === true || isActive === "true",
    });

    res.status(201).json({
      success: true,
      message: `Album created with ${images.length} images`,
      data: album,
    });
  } catch (error) {
    console.error("Create gallery error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
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
// UPDATE ALBUM
// ======================================================
const updateGalleryItem = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    const payload = { ...req.body };

    // 1. Handle existing images (after user removed some in admin)
    if (req.body.existingImages) {
      try {
        const existing = JSON.parse(req.body.existingImages);
        payload.images = existing;
      } catch (e) {
        // if parse fails, keep original images
        payload.images = album.images || [];
      }
    } else {
      // if no existingImages sent, keep current ones
      payload.images = album.images || [];
    }

    // 2. If new images are uploaded → add them
    if (req.files && req.files.length > 0) {
      const uploaded = await Promise.all(
        req.files.map((file) =>
          uploadToCloudinary(file.buffer, "babylon-school/gallery")
        )
      );

      const newImages = uploaded.map((img) => ({
        url: img.url,
        caption: "",
      }));

      payload.images = [...payload.images, ...newImages];
    }

    // 3. Update cover image
    if (payload.images && payload.images.length > 0) {
      payload.coverImage = payload.images[0].url;
    } else {
      payload.coverImage = "";
    }

    // Clean fields that should not be saved
    delete payload.existingImages;
    delete payload.image;

    const updatedAlbum = await Gallery.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: updatedAlbum,
    });
  } catch (error) {
    console.error("Update gallery error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid album ID",
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
// DELETE ALBUM
// ======================================================
const deleteGalleryItem = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Album deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid album ID",
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
// TOGGLE STATUS
// ======================================================
const toggleGalleryStatus = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    album.isActive = !album.isActive;
    await album.save();

    res.status(200).json({
      success: true,
      message: `Album ${
        album.isActive ? "activated" : "deactivated"
      } successfully`,
      data: album,
    });
  } catch (error) {
    console.error("Toggle gallery status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE FEATURED
// ======================================================
const toggleFeaturedStatus = async (req, res) => {
  try {
    const album = await Gallery.findById(req.params.id);

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    album.isFeatured = !album.isFeatured;
    await album.save();

    res.status(200).json({
      success: true,
      message: `Album ${
        album.isFeatured ? "marked as featured" : "removed from featured"
      } successfully`,
      data: album,
    });
  } catch (error) {
    console.error("Toggle featured error:", error);
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