const Facility = require("../models/facility.model");
const { uploadToCloudinary } = require("../services/storage.service");

const getFacilities = async (req, res) => {
  try {
    const items = await Facility.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Get facilities error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getSingleFacility = async (req, res) => {
  try {
    const item = await Facility.findOne({ _id: req.params.id, isActive: true });
    if (!item) return res.status(404).json({ success: false, message: "Facility not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Get single facility error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid facility ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const createFacility = async (req, res) => {
  try {
    const { title, description, icon, displayOrder, isActive } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    let imageUrl;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "babylon-school/facilities");
      imageUrl = uploaded.url;
    }

    const facility = await Facility.create({ title, description, image: imageUrl, icon, displayOrder, isActive });
    res.status(201).json({ success: true, message: "Facility created successfully", data: facility });
  } catch (error) {
    console.error("Create facility error:", error);
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });

    const payload = { ...req.body };
    delete payload.image;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "babylon-school/facilities");
      payload.image = uploaded.url;
    }

    const updated = await Facility.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Facility updated successfully", data: updated });
  } catch (error) {
    console.error("Update facility error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid facility ID" });
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });
    await Facility.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Facility deleted successfully" });
  } catch (error) {
    console.error("Delete facility error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid facility ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const toggleFacilityStatus = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });
    facility.isActive = !facility.isActive;
    await facility.save();
    res.status(200).json({ success: true, message: `Facility ${facility.isActive ? "activated" : "deactivated"} successfully`, data: facility });
  } catch (error) {
    console.error("Toggle facility status error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid facility ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getFacilities,
  getSingleFacility,
  createFacility,
  updateFacility,
  deleteFacility,
  toggleFacilityStatus,
};