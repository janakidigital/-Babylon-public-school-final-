const { updateWithMediaCleanup, deleteWithMediaCleanup } = require("../services/mediaCleanup.service");
const Download = require("../models/download.model");
const { uploadToLocal } = require("../services/storage.service");

const { parseCalendarDate } = require("../utils/calendarDate");

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
      documentDate: -1,
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
    const documentDate = parseCalendarDate(req.body.documentDate, "Document date");

    let fileUrl = req.body.file || "";

    if (req.file) {
      const uploadedFile = await uploadToLocal(req.file, "babylon-school/downloads");
      fileUrl = uploadedFile.url;
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const download = await Download.create({
      title,
      description,
      documentDate,
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
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode === 400 ? error.message : "Server error",
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
    if (req.body.documentDate !== undefined) {
      payload.documentDate = parseCalendarDate(req.body.documentDate, "Document date");
    }

    if (req.file) {
      const uploadedFile = await uploadToLocal(req.file, "babylon-school/downloads");
      payload.file = uploadedFile.url;
    }

    const updatedDownload = await updateWithMediaCleanup(download, () => Download.findByIdAndUpdate(
      req.params.id,
      payload,
      { new: true, runValidators: true }
    ));

    res.status(200).json({
      success: true,
      message: "Download updated successfully",
      data: updatedDownload,
    });
  } catch (error) {
    console.error("Update download error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode === 400 ? error.message : "Server error",
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

    await deleteWithMediaCleanup(() => Download.findByIdAndDelete(req.params.id));

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
