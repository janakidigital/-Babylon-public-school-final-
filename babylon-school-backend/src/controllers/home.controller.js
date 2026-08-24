const Home = require("../models/home.model");

// ======================================================
// GET HOME PAGE
// GET /api/home
// Public
// ======================================================
const getHome = async (req, res) => {
  try {
    const home = await Home.findOne({ isActive: true }) || await Home.findOne();

    res.status(200).json({
      success: true,
      data: home || null,
    });
  } catch (error) {
    console.error("Get home error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE HOME PAGE
// POST /api/home
// Protected
// ======================================================
const createHome = async (req, res) => {
  try {
    // Check if homepage already exists
    const existingHome = await Home.findOne();

    if (existingHome) {
      return res.status(400).json({
        success: false,
        message: "Homepage content already exists",
      });
    }

    const home = await Home.create(req.body);

    res.status(201).json({
      success: true,
      message: "Homepage content created successfully",
      data: home,
    });
  } catch (error) {
    console.error("Create home error:", error);

    // Mongoose validation error
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
// UPDATE HOME PAGE
// PUT /api/home
// Protected
// ======================================================
const updateHome = async (req, res) => {
  try {
    let home = await Home.findOne();
    const payload = req.body;

    if (!home) {
      home = await Home.create({
        hero: { title: payload.hero?.title || "Education for the Quest" },
        ...payload,
      });
    } else {
      home = await Home.findByIdAndUpdate(home._id, payload, {
        new: true,
        runValidators: true,
      });
    }

    res.status(200).json({
      success: true,
      message: "Homepage content saved successfully",
      data: home,
    });
  } catch (error) {
    console.error("Update home error:", error);

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
// DELETE HOME PAGE
// DELETE /api/home
// Protected
// ======================================================
const deleteHome = async (req, res) => {
  try {
    const home = await Home.findOne();

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Homepage content not found",
      });
    }

    await Home.findByIdAndDelete(home._id);

    res.status(200).json({
      success: true,
      message: "Homepage content deleted successfully",
    });
  } catch (error) {
    console.error("Delete home error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE HOME STATUS
// PATCH /api/home/status
// Protected
// ======================================================
const toggleHomeStatus = async (req, res) => {
  try {
    const home = await Home.findOne();

    if (!home) {
      return res.status(404).json({
        success: false,
        message: "Homepage content not found",
      });
    }

    home.isActive = !home.isActive;

    await home.save();

    res.status(200).json({
      success: true,
      message: `Homepage ${home.isActive ? "activated" : "deactivated"} successfully`,
      data: home,
    });
  } catch (error) {
    console.error("Toggle home status error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getHome,
  createHome,
  updateHome,
  deleteHome,
  toggleHomeStatus,
};