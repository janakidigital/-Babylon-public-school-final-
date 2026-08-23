const Career = require("../models/career.model");
const CareerApplication = require("../models/careerApplication.model");
const { uploadToCloudinary } = require("../services/storage.service");

const getCareers = async (req, res) => {
  try {
    const items = await Career.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Get careers error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getSingleCareer = async (req, res) => {
  try {
    const item = await Career.findOne({ _id: req.params.id, isActive: true });
    if (!item) return res.status(404).json({ success: false, message: "Career not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Get single career error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid career ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const createCareer = async (req, res) => {
  try {
    const { title, description, location, type, department, closingDate, isActive } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    const career = await Career.create({ title, description, location, type, department, closingDate, isActive });
    res.status(201).json({ success: true, message: "Career created successfully", data: career });
  } catch (error) {
    console.error("Create career error:", error);
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateCareer = async (req, res) => {
  try {
    const item = await Career.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Career not found" });

    const updated = await Career.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Career updated successfully", data: updated });
  } catch (error) {
    console.error("Update career error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid career ID" });
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteCareer = async (req, res) => {
  try {
    const item = await Career.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Career not found" });
    await Career.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Career deleted successfully" });
  } catch (error) {
    console.error("Delete career error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid career ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Application
const applyToCareer = async (req, res) => {
  try {
    const { careerId } = req.params;
    const { name, email, phone, coverLetter } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Applicant name is required" });

    let resumeUrl;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "babylon-school/careers");
      resumeUrl = uploaded.url;
    }

    const career = await Career.findById(careerId);
    if (!career) return res.status(404).json({ success: false, message: "Career not found" });

    const application = await CareerApplication.create({ career: careerId, name, email, phone, coverLetter, resumeUrl });
    res.status(201).json({ success: true, message: "Application submitted", data: application });
  } catch (error) {
    console.error("Apply to career error:", error);
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const toggleCareerStatus = async (req, res) => {
  try {
    const item = await Career.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Career not found" });
    item.isActive = !item.isActive;
    await item.save();
    res.status(200).json({ success: true, message: `Career ${item.isActive ? "activated" : "deactivated"} successfully`, data: item });
  } catch (error) {
    console.error("Toggle career status error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid career ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getCareers,
  getSingleCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  applyToCareer,
  toggleCareerStatus,
};