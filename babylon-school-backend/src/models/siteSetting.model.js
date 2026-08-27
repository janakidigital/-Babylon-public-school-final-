const mongoose = require("mongoose");

const siteSettingSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    favicon: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    shortDescription: {
      type: String,
      trim: true,
    },

    socialLinks: {
      facebook: { type: String, default: "" },
      instagram: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },

    googleMapUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);