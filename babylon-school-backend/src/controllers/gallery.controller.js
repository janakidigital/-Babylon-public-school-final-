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
// CREATE ALBUM (with images and/or videos)
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
      type, // Frontend sends 'type'
      mediaType: reqMediaType,
      videoUrls, // YouTube links (one per line)
    } = req.body;

    const files = req.files || [];

    console.log("📦 Creating gallery item:");
    console.log("  - Type:", type);
    console.log("  - Title:", title);
    console.log("  - Files received:", files.length);
    console.log("  - File types:", files.map(f => f.mimetype));

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Album title is required",
      });
    }

    // Determine media type from frontend's 'type' or 'mediaType' field
    const rawType = String(type || reqMediaType || category || "").toLowerCase();
    const mediaType = rawType === "videos" ? "Videos" : "Photos";

    // 1. Process uploaded images (for Photos albums)
    let images = [];
    if (files.length > 0 && mediaType === "Photos") {
      const imageFiles = files.filter((file) =>
        file.mimetype.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i.test(file.originalname)
      );

      if (imageFiles.length > 0) {
        const uploaded = await Promise.all(
          imageFiles.map((file) =>
            uploadToCloudinary(file.buffer, "babylon-school/gallery", file.mimetype)
          ),
        );
        images = uploaded.map((img) => ({
          url: img.url,
          caption: "",
        }));
      }
    }

    // 2. Process YouTube links (if provided)
    const youtubeVideos = String(videoUrls || "")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.startsWith("http"))
      .map((url) => ({
        url,
        title: "",
        caption: "",
        type: "youtube",
      }));

    // 3. Process uploaded video files (for Videos albums)
    let uploadedVideos = [];
    if (files.length > 0 && mediaType === "Videos") {
      const videoFiles = files.filter((file) =>
        file.mimetype.startsWith("video/") ||
        /\.(mp4|mkv|mov|avi|wmv|webm|flv|m4v|3gp|ogv)$/i.test(file.originalname)
      );

      if (videoFiles.length > 0) {
        const uploaded = await Promise.all(
          videoFiles.map((file) =>
            uploadToCloudinary(file.buffer, "babylon-school/gallery/videos", file.mimetype || "video/mp4")
          ),
        );
        uploadedVideos = uploaded.map((vid) => ({
          url: vid.url,
          title: "",
          caption: "",
          type: "uploaded",
        }));
      }
    }

    // Combine all videos (YouTube + uploaded)
    const allVideos = [...youtubeVideos, ...uploadedVideos];

    // Validation based on media type
    if (mediaType === "Photos" && images.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image for a Photos album",
      });
    }

    if (mediaType === "Videos" && allVideos.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please add at least one YouTube link or upload a video file for a Videos album",
      });
    }

    // Create album with correct mediaType
    const album = await Gallery.create({
      title,
      description,
      coverImage:
        images.length > 0
          ? images[0].url
          : allVideos.length > 0
          ? allVideos[0].url
          : "",
      images,
      videos: allVideos,
      mediaType,
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
      message: `Album created with ${images.length} images and ${allVideos.length} videos`,
      data: album,
    });
  } catch (error) {
    console.error("❌ Create gallery error:", error);
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
    const files = req.files || [];

    console.log("📝 Updating gallery item:");
    console.log("  - ID:", req.params.id);
    console.log("  - Files received:", files.length);
    console.log("  - File types:", files.map(f => f.mimetype));

    // 1. Handle existing images
    if (req.body.existingImages) {
      try {
        const existing = JSON.parse(req.body.existingImages);
        payload.images = existing;
      } catch (e) {
        payload.images = album.images || [];
      }
    } else {
      payload.images = album.images || [];
    }

    // 2. Handle existing videos
    let currentVideos = [];
    if (req.body.existingVideos) {
      try {
        const existingVids = JSON.parse(req.body.existingVideos);
        currentVideos = existingVids;
      } catch (e) {
        currentVideos = album.videos || [];
      }
    } else {
      currentVideos = album.videos || [];
    }

    // 3. If new images are uploaded → add them
    if (files.length > 0) {
      const imageFiles = files.filter((file) =>
        file.mimetype.startsWith("image/") ||
        /\.(jpg|jpeg|png|gif|webp|svg|bmp|avif)$/i.test(file.originalname)
      );

      if (imageFiles.length > 0) {
        const uploaded = await Promise.all(
          imageFiles.map((file) =>
            uploadToCloudinary(file.buffer, "babylon-school/gallery", file.mimetype)
          ),
        );

        const newImages = uploaded.map((img) => ({
          url: img.url,
          caption: "",
        }));

        payload.images = [...payload.images, ...newImages];
      }
    }

    // 4. Handle YouTube video links
    let youtubeVideos = [];
    if (req.body.videoUrls !== undefined && req.body.videoUrls.trim() !== "") {
      const videoUrlsRaw = req.body.videoUrls || "";
      const parsedYoutube = String(videoUrlsRaw)
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.startsWith("http"))
        .map((url) => ({
          url,
          title: "",
          caption: "",
          type: "youtube",
        }));
      
      const existingUrls = new Set(currentVideos.map(v => v.url));
      youtubeVideos = parsedYoutube.filter(v => !existingUrls.has(v.url));
    }

    // 5. Handle uploaded video files
    let uploadedVideos = [];
    if (files.length > 0) {
      const videoFiles = files.filter((file) =>
        file.mimetype.startsWith("video/") ||
        /\.(mp4|mkv|mov|avi|wmv|webm|flv|m4v|3gp|ogv)$/i.test(file.originalname)
      );

      if (videoFiles.length > 0) {
        const uploaded = await Promise.all(
          videoFiles.map((file) =>
            uploadToCloudinary(file.buffer, "babylon-school/gallery/videos", file.mimetype || "video/mp4")
          ),
        );
        uploadedVideos = uploaded.map((vid) => ({
          url: vid.url,
          title: "",
          caption: "",
          type: "uploaded",
        }));
      }
    }

    // Combine videos: current/retained + new YouTube + new uploaded
    payload.videos = [...currentVideos, ...youtubeVideos, ...uploadedVideos];

    // 6. Handle mediaType
    const rawType = String(req.body.type || req.body.mediaType || "").toLowerCase();
    if (rawType) {
      payload.mediaType = rawType === "videos" ? "Videos" : "Photos";
    } else {
      payload.mediaType = album.mediaType || "Photos";
    }

    // 7. Update cover image
    if (payload.images && payload.images.length > 0) {
      payload.coverImage = payload.images[0].url;
    } else if (payload.videos && payload.videos.length > 0) {
      payload.coverImage = payload.videos[0].url;
    } else {
      payload.coverImage = album.coverImage || "";
    }

    // Clean fields that should not be saved directly to model
    delete payload.existingImages;
    delete payload.existingVideos;
    delete payload.image;
    delete payload.videoUrls;
    delete payload.type;

    const updatedAlbum = await Gallery.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: updatedAlbum,
    });
  } catch (error) {
    console.error("❌ Update gallery error:", error);
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
      message: `Album ${album.isActive ? "activated" : "deactivated"} successfully`,
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
      message: `Album ${album.isFeatured ? "marked as featured" : "removed from featured"} successfully`,
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