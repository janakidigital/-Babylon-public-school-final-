const Achievement = require("../models/achievement.model");
const { uploadToCloudinary } = require("../services/storage.service");

const getAchievements = async (req, res) => {
  try {
    const items = await Achievement.find({ isActive: true }).sort({ displayOrder: 1, year: -1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Get achievements error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getSingleAchievement = async (req, res) => {
  try {
    const item = await Achievement.findOne({ _id: req.params.id, isActive: true });
    if (!item) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Get single achievement error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid achievement ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const createAchievement = async (req, res) => {
  try {
    const { title, description, year, category, displayOrder, isFeatured, isActive } = req.body;
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });

    let imageUrl;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "babylon-school/achievements");
      imageUrl = uploaded.url;
    }

    const achievement = await Achievement.create({ title, description, year, category, image: imageUrl, displayOrder, isFeatured, isActive });
    res.status(201).json({ success: true, message: "Achievement created successfully", data: achievement });
  } catch (error) {
    console.error("Create achievement error:", error);
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Achievement not found" });

    const payload = { ...req.body };
    delete payload.image;

    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "babylon-school/achievements");
      payload.image = uploaded.url;
    }

    const updated = await Achievement.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "Achievement updated successfully", data: updated });
  } catch (error) {
    console.error("Update achievement error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid achievement ID" });
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Achievement not found" });
    await Achievement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Achievement deleted successfully" });
  } catch (error) {
    console.error("Delete achievement error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid achievement ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const toggleAchievementStatus = async (req, res) => {
  try {
    const item = await Achievement.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Achievement not found" });
    item.isActive = !item.isActive;
    await item.save();
    res.status(200).json({ success: true, message: `Achievement ${item.isActive ? "activated" : "deactivated"} successfully`, data: item });
  } catch (error) {
    console.error("Toggle achievement status error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid achievement ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getAchievements,
  getSingleAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  toggleAchievementStatus,
};