const mongoose = require("mongoose");

// =========================
// Feature Schema
// =========================
const featureSchema = new mongoose.Schema(
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

// =========================
// Statistic Schema
// =========================
const statisticSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
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

// =========================
// Home Schema
// =========================
const homeSchema = new mongoose.Schema(
  {
    // =========================
    // Hero Section
    // =========================
    hero: {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      subtitle: {
        type: String,
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

      buttonText: {
        type: String,
        trim: true,
      },

      buttonLink: {
        type: String,
        trim: true,
      },
    },

    // =========================
    // About Section
    // =========================
    about: {
      title: {
        type: String,
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

      buttonText: {
        type: String,
        trim: true,
      },

      buttonLink: {
        type: String,
        trim: true,
      },
    },

    // =========================
    // Statistics Section
    // =========================
    statistics: {
      type: [statisticSchema],
      default: [],
    },

    // =========================
    // Why Choose Us Section
    // =========================
    whyChooseUs: {
      title: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      features: {
        type: [featureSchema],
        default: [],
      },
    },

    // =========================
    // CTA Section
    // =========================
    cta: {
      title: {
        type: String,
        trim: true,
      },

      description: {
        type: String,
        trim: true,
      },

      buttonText: {
        type: String,
        trim: true,
      },

      buttonLink: {
        type: String,
        trim: true,
      },
    },

    // =========================
    // Status
    // =========================
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Home", homeSchema);