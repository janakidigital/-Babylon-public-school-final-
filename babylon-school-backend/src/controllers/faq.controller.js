const Faq = require("../models/faq.model");

const getFaqs = async (req, res) => {
  try {
    const items = await Faq.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    console.error("Get faqs error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const getSingleFaq = async (req, res) => {
  try {
    const item = await Faq.findOne({ _id: req.params.id, isActive: true });
    if (!item) return res.status(404).json({ success: false, message: "FAQ not found" });
    res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("Get single faq error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid FAQ ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const createFaq = async (req, res) => {
  try {
    const { question, answer, category, displayOrder, isActive } = req.body;
    if (!question) return res.status(400).json({ success: false, message: "Question is required" });

    const faq = await Faq.create({ question, answer, category, displayOrder, isActive });
    res.status(201).json({ success: true, message: "FAQ created successfully", data: faq });
  } catch (error) {
    console.error("Create faq error:", error);
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const updateFaq = async (req, res) => {
  try {
    const item = await Faq.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "FAQ not found" });

    const updated = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: "FAQ updated successfully", data: updated });
  } catch (error) {
    console.error("Update faq error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid FAQ ID" });
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const deleteFaq = async (req, res) => {
  try {
    const item = await Faq.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "FAQ not found" });
    await Faq.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Delete faq error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid FAQ ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

const toggleFaqStatus = async (req, res) => {
  try {
    const item = await Faq.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "FAQ not found" });
    item.isActive = !item.isActive;
    await item.save();
    res.status(200).json({ success: true, message: `FAQ ${item.isActive ? "activated" : "deactivated"} successfully`, data: item });
  } catch (error) {
    console.error("Toggle faq status error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid FAQ ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  getFaqs,
  getSingleFaq,
  createFaq,
  updateFaq,
  deleteFaq,
  toggleFaqStatus,
};