const CareerApplication = require("../models/careerApplication.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// CREATE APPLICATION (Public)
// POST /api/v1/career-applications/apply
// ======================================================
const createApplication = async (req, res) => {
  try {
    const { careerTitle, name, email, phone, coverLetter } = req.body;
    if (!careerTitle) return res.status(400).json({ success: false, message: "Career title is required" });
    if (!name) return res.status(400).json({ success: false, message: "Applicant name is required" });

    let resumeUrl;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "babylon-school/careers");
      resumeUrl = uploaded.url;
    }

    const application = await CareerApplication.create({ careerTitle, name, email, phone, coverLetter, resumeUrl });
    res.status(201).json({ success: true, message: "Application submitted", data: application });
  } catch (error) {
    console.error("Create application error:", error);
    if (error.name === "ValidationError") return res.status(400).json({ success: false, message: "Validation error", errors: Object.values(error.errors).map(e => e.message) });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// GET ALL APPLICATIONS
// GET /api/v1/career-applications
// Protected (admin)
// ======================================================
const getApplications = async (req, res) => {
  try {
    const apps = await CareerApplication.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: apps.length, data: apps });
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// GET SINGLE APPLICATION
// GET /api/v1/career-applications/:id
// Protected (admin)
// ======================================================
const getSingleApplication = async (req, res) => {
  try {
    const app = await CareerApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });
    res.status(200).json({ success: true, data: app });
  } catch (error) {
    console.error("Get single application error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid application ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// DELETE APPLICATION
// DELETE /api/v1/career-applications/:id
// Protected (admin)
// ======================================================
const deleteApplication = async (req, res) => {
  try {
    const app = await CareerApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });
    await CareerApplication.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("Delete application error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid application ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ======================================================
// UPDATE APPLICATION STATUS
// PATCH /api/v1/career-applications/:id/status
// Protected (admin)
// ======================================================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ success: false, message: "Status is required" });

    const app = await CareerApplication.findById(req.params.id);
    if (!app) return res.status(404).json({ success: false, message: "Application not found" });

    app.status = status;
    await app.save();

    res.status(200).json({ success: true, message: "Application status updated", data: app });
  } catch (error) {
    console.error("Update application status error:", error);
    if (error.name === "CastError") return res.status(400).json({ success: false, message: "Invalid application ID" });
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getSingleApplication,
  deleteApplication,
  updateApplicationStatus,
};