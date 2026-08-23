const Faculty = require("../models/faculty.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL FACULTY
// GET /api/v1/faculty
// Public
// ======================================================
const getFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty,
    });
  } catch (error) {
    console.error("Get faculty error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// GET SINGLE FACULTY
// GET /api/v1/faculty/:id
// Public
// ======================================================
const getSingleFaculty = async (req, res) => {
  try {
    const item = await Faculty.findOne({ _id: req.params.id, isActive: true });

    if (!item) {
      return res.status(404).json({ success: false, message: "Faculty member not found" });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Get single faculty error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid faculty ID" });
    }

    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// CREATE FACULTY
// POST /api/v1/faculty
// Protected
// ======================================================
const createFaculty = async (req, res) => {
  try {
    const { name, designation, department, qualification, bio, email, phone, displayOrder, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "babylon-school/faculty");
      imageUrl = uploadedImage.url;
    }

    const faculty = await Faculty.create({
      name,
      designation,
      department,
      qualification,
      bio,
      image: imageUrl,
      email,
      phone,
      displayOrder,
      isActive,
    });

    res.status(201).json({ success: true, message: "Faculty created successfully", data: faculty });
  } catch (error) {
    console.error("Create faculty error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    }

    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// UPDATE FACULTY
// PUT /api/v1/faculty/:id
// Protected
// ======================================================
const updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty member not found" });
    }

    const payload = { ...req.body };
    delete payload.image;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(req.file.buffer, "babylon-school/faculty");
      payload.image = uploadedImage.url;
    }

    const updated = await Faculty.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: "Faculty updated successfully", data: updated });
  } catch (error) {
    console.error("Update faculty error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid faculty ID" });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    }

    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// DELETE FACULTY
// DELETE /api/v1/faculty/:id
// Protected
// ======================================================
const deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty member not found" });
    }

    await Faculty.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    console.error("Delete faculty error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid faculty ID" });
    }

    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// TOGGLE FACULTY STATUS
// PATCH /api/v1/faculty/:id/status
// Protected
// ======================================================
const toggleFacultyStatus = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);

    if (!faculty) {
      return res.status(404).json({ success: false, message: "Faculty member not found" });
    }

    faculty.isActive = !faculty.isActive;
    await faculty.save();

    res.status(200).json({ success: true, message: `Faculty ${faculty.isActive ? "activated" : "deactivated"} successfully`, data: faculty });
  } catch (error) {
    console.error("Toggle faculty status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ success: false, message: "Invalid faculty ID" });
    }

    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getFaculty,
  getSingleFaculty,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  toggleFacultyStatus,
};