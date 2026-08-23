const mongoose = require("mongoose");

// ==========================================
// Program Schema
// ==========================================
const programSchema = new mongoose.Schema(
  {
    // ==========================================
    // Basic Information
    // ==========================================
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // Program Image
    // ==========================================
    image: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Program Details
    // ==========================================
    duration: {
      type: String,
      trim: true,
    },

    level: {
      type: String,
      trim: true,
    },

    eligibility: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Program Highlights
    // ==========================================
    highlights: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Career Opportunities
    // ==========================================
    careerOpportunities: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Featured Program
    // ==========================================
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // Program Status
    // ==========================================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Program", programSchema);