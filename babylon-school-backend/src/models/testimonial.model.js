const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema(
  {
    // ==========================================
    // Person Information
    // ==========================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Testimonial
    // ==========================================
    message: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // Profile Image
    // ==========================================
    image: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Rating
    // ==========================================
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },

    // ==========================================
    // Category
    // ==========================================
    category: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Featured
    // ==========================================
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // Status
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

module.exports = mongoose.model("Testimonial", testimonialSchema);