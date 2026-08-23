const About = require("../models/about.model");

// ======================================================
// GET ABOUT PAGE
// GET /api/v1/about
// Public
// ======================================================
const getAbout = async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page content not found",
      });
    }

    res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("Get about error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE ABOUT PAGE
// POST /api/v1/about
// Protected
// ======================================================
const createAbout = async (req, res) => {
  try {
    // About page should have only one document
    const existingAbout = await About.findOne();

    if (existingAbout) {
      return res.status(400).json({
        success: false,
        message: "About page content already exists",
      });
    }

    const about = await About.create(req.body);

    res.status(201).json({
      success: true,
      message: "About page content created successfully",
      data: about,
    });
  } catch (error) {
    console.error("Create about error:", error);

    // Mongoose validation error
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
// UPDATE ABOUT PAGE
// PUT /api/v1/about
// Protected
// ======================================================
const updateAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page content not found",
      });
    }

    const updatedAbout = await About.findByIdAndUpdate(
      about._id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "About page content updated successfully",
      data: updatedAbout,
    });
  } catch (error) {
    console.error("Update about error:", error);

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
// DELETE ABOUT PAGE
// DELETE /api/v1/about
// Protected
// ======================================================
const deleteAbout = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page content not found",
      });
    }

    await About.findByIdAndDelete(about._id);

    res.status(200).json({
      success: true,
      message: "About page content deleted successfully",
    });
  } catch (error) {
    console.error("Delete about error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE ABOUT STATUS
// PATCH /api/v1/about/status
// Protected
// ======================================================
const toggleAboutStatus = async (req, res) => {
  try {
    const about = await About.findOne();

    if (!about) {
      return res.status(404).json({
        success: false,
        message: "About page content not found",
      });
    }

    about.isActive = !about.isActive;

    await about.save();

    res.status(200).json({
      success: true,
      message: `About page ${
        about.isActive ? "activated" : "deactivated"
      } successfully`,
      data: about,
    });
  } catch (error) {
    console.error("Toggle about status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAbout,
  createAbout,
  updateAbout,
  deleteAbout,
  toggleAboutStatus,
};