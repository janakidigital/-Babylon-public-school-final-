const mongoose = require("mongoose");

// ==========================================
// News Schema
// ==========================================
const newsSchema = new mongoose.Schema(
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

    content: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================================
    // Image
    // ==========================================
    image: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Author
    // ==========================================
    author: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Category
    // ==========================================
    category: {
      type: String,
      trim: true,
    },

    // ==========================================
    // Tags
    // ==========================================
    tags: {
      type: [String],
      default: [],
    },

    // ==========================================
    // Publishing
    // ==========================================
    publishedAt: {
      type: Date,
    },

    isPublished: {
      type: Boolean,
      default: false,
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

module.exports = mongoose.model("News", newsSchema);