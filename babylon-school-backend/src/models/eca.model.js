const mongoose = require("mongoose");

const ecaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Enhancing ECA", "Extra Curricular Activities", "General ECA"],
      default: "Enhancing ECA",
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    images: [
      {
        url: { type: String, required: true },
        caption: { type: String, trim: true, default: "" },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ECA", ecaSchema);
