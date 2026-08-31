const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
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
    // Support for both YouTube links AND uploaded videos
    videos: [
      {
        url: { type: String, required: true, trim: true },
        title: { type: String, trim: true, default: "" },
        caption: { type: String, trim: true, default: "" },
        type: {
          type: String,
          enum: ["youtube", "uploaded"],
          default: "youtube",
        },
      },
    ],
    mediaType: {
      type: String,
      enum: ["Photos", "Videos"],
      default: "Photos",
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
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
  },
);

module.exports = mongoose.model("Gallery", gallerySchema);