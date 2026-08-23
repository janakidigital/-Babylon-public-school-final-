const mongoose = require("mongoose");

const admissionSchema = new mongoose.Schema(
  {
    // ==========================================
    // Student Information
    // ==========================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    address: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Parent / Guardian Information
    // ==========================================
    parentName: {
      type: String,
      required: true,
      trim: true,
    },

    parentPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // Academic Information
    // ==========================================
    program: {
      type: String,
      required: true,
      trim: true,
    },

    previousSchool: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Additional Message
    // ==========================================
    message: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Application Status
    // ==========================================
    status: {
      type: String,
      enum: [
        "pending",
        "reviewing",
        "approved",
        "rejected",
      ],
      default: "pending",
    },

    // ==========================================
    // Admin Note
    // ==========================================
    adminNote: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Admission",
  admissionSchema
);