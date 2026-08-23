const Admission = require("../models/admission.model");

// ======================================================
// GET ALL ADMISSIONS
// GET /api/v1/admissions
// Protected
// ======================================================
const getAdmissions = async (req, res) => {
  try {
    const admissions = await Admission.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: admissions.length,
      data: admissions,
    });
  } catch (error) {
    console.error("Get admissions error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE ADMISSION
// GET /api/v1/admissions/:id
// Protected
// ======================================================
const getAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(
      req.params.id
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission application not found",
      });
    }

    res.status(200).json({
      success: true,
      data: admission,
    });
  } catch (error) {
    console.error("Get admission error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
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
// SUBMIT ADMISSION
// POST /api/v1/admissions
// Public
// ======================================================
const submitAdmission = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      parentName,
      parentPhone,
      program,
      previousSchool,
      message,
    } = req.body;

    // Required fields
    if (
      !name ||
      !email ||
      !phone ||
      !parentName ||
      !parentPhone ||
      !program
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, parent name, parent phone and program are required",
      });
    }

    // Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Gender validation
    if (
      gender !== undefined &&
      !["male", "female", "other"].includes(gender)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Gender must be male, female or other",
      });
    }

    const admission = await Admission.create({
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      parentName,
      parentPhone,
      program,
      previousSchool,
      message,
    });

    res.status(201).json({
      success: true,
      message:
        "Admission application submitted successfully",
      data: admission,
    });
  } catch (error) {
    console.error(
      "Submit admission error:",
      error
    );

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
// UPDATE ADMISSION
// PUT /api/v1/admissions/:id
// Protected
// ======================================================
const updateAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(
      req.params.id
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission application not found",
      });
    }

    const {
      status,
      adminNote,
    } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewing",
      "approved",
      "rejected",
    ];

    if (
      status !== undefined &&
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: pending, reviewing, approved, rejected",
      });
    }

    const updatedAdmission =
      await Admission.findByIdAndUpdate(
        req.params.id,
        {
          status,
          adminNote,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message:
        "Admission application updated successfully",
      data: updatedAdmission,
    });
  } catch (error) {
    console.error(
      "Update admission error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
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
// UPDATE ADMISSION STATUS
// PATCH /api/v1/admissions/:id/status
// Protected
// ======================================================
const updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewing",
      "approved",
      "rejected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: pending, reviewing, approved, rejected",
      });
    }

    const admission =
      await Admission.findByIdAndUpdate(
        req.params.id,
        { status },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission application not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Admission status updated successfully",
      data: admission,
    });
  } catch (error) {
    console.error(
      "Update admission status error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
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
// DELETE ADMISSION
// DELETE /api/v1/admissions/:id
// Protected
// ======================================================
const deleteAdmission = async (req, res) => {
  try {
    const admission = await Admission.findById(
      req.params.id
    );

    if (!admission) {
      return res.status(404).json({
        success: false,
        message: "Admission application not found",
      });
    }

    await Admission.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Admission application deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete admission error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid admission ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAdmissions,
  getAdmission,
  submitAdmission,
  updateAdmission,
  updateAdmissionStatus,
  deleteAdmission,
};