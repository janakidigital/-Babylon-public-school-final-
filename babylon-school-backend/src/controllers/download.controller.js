const Download = require("../models/download.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL DOWNLOADS
// GET /api/v1/downloads
// Public
// ======================================================
const getDownloads = async (req, res) => {
  try {
    const isAdmin = req.user && ["admin", "superAdmin"].includes(req.user.role);
    const downloads = await Download.find(isAdmin ? {} : {
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: downloads.length,
      data: downloads,
    });
  } catch (error) {
    console.error("Get downloads error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE DOWNLOAD
// POST /api/v1/downloads
// Protected
// ======================================================
const createDownload = async (req, res) => {
  try {
    const { title, description, category, isActive } = req.body;

    let fileUrl = req.body.file || "";

    if (req.file) {
      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/downloads",
        req.file.mimetype
      );
      fileUrl = uploadedFile.url;
    }

    if (!title || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and file are required",
      });
    }

    const download = await Download.create({
      title,
      description,
      file: fileUrl,
      category,
      isActive: isActive === undefined || isActive === "" ? true : isActive === true || isActive === "true",
    });

    res.status(201).json({
      success: true,
      message: "Download created successfully",
      data: download,
    });
  } catch (error) {
    console.error("Create download error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE DOWNLOAD
// PUT /api/v1/downloads/:id
// Protected
// ======================================================
const updateDownload = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found",
      });
    }

    const payload = { ...req.body };
    delete payload.file;

    if (req.file) {
      const uploadedFile = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/downloads",
        req.file.mimetype
      );
      payload.file = uploadedFile.url;
    }

    const updatedDownload = await Download.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Download updated successfully",
      data: updatedDownload,
    });
  } catch (error) {
    console.error("Update download error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE DOWNLOAD
// DELETE /api/v1/downloads/:id
// Protected
// ======================================================
const deleteDownload = async (req, res) => {
  try {
    const download = await Download.findById(req.params.id);

    if (!download) {
      return res.status(404).json({
        success: false,
        message: "Download not found",
      });
    }

    await Download.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Download deleted successfully",
    });
  } catch (error) {
    console.error("Delete download error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getDownloads,
  createDownload,
  updateDownload,
  deleteDownload,
};
