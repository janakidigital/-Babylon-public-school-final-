const mongoose = require("mongoose");

// ==========================================
// Core Value Schema
// ==========================================
const coreValueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    icon: {
      type: String,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

// ==========================================
// About Schema
// ==========================================
const aboutSchema = new mongoose.Schema(
  {
    // ==========================================
    // Introduction Section
    // ==========================================
    introduction: {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      image: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // Mission
    // ==========================================
    mission: {
      title: {
        type: String,
        trim: true,
        default: "Our Mission",
      },

      description: {
        type: String,
        trim: true,
      },

      image: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // Vision
    // ==========================================
    vision: {
      title: {
        type: String,
        trim: true,
        default: "Our Vision",
      },

      description: {
        type: String,
        trim: true,
      },

      image: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // Principal / Chairperson Message
    // ==========================================
    leadershipMessage: {
      name: {
        type: String,
        trim: true,
      },

      designation: {
        type: String,
        trim: true,
      },

      message: {
        type: String,
        trim: true,
      },

      image: {
        type: String,
        trim: true,
      },
    },

    // ==========================================
    // Core Values
    // ==========================================
    coreValues: {
      type: [coreValueSchema],
      default: [],
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

module.exports = mongoose.model("About", aboutSchema);