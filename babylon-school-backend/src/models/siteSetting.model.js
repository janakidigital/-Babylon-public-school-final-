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

    // Statistics (Students, Teachers, Since)
    stats: {
      studentsCount: { type: String, default: "1000+" },
      studentsLabel: { type: String, default: "Students" },
      teachersCount: { type: String, default: "30+" },
      teachersLabel: { type: String, default: "Teachers" },
      sinceValue: { type: String, default: "1996 A.D." },
      sinceLabel: { type: String, default: "Since" },
    },

    // Student Life section content and image
    studentLife: {
      eyebrow: { type: String, default: "LIFE AT BABYLON" },
      title: { type: String, default: "Every day is an opportunity to shine." },
      description: {
        type: String,
        default:
          "Beyond the classroom, students grow through sport, arts, scouting, music, dance and service — a home away from home in Shantinagar.",
      },
      heading: { type: String, default: "Growing with purpose and pride." },
      image: { type: String, default: "" },
    },

    // Page Banners / Cover Images
    pageBanners: {
      about: { type: String, default: "" },
      academics: { type: String, default: "" },
      admissions: { type: String, default: "" },
      studentLife: { type: String, default: "" },
      careers: { type: String, default: "" },
      news: { type: String, default: "" },
      events: { type: String, default: "" },
      notices: { type: String, default: "" },
      gallery: { type: String, default: "" },
      facilities: { type: String, default: "" },
      team: { type: String, default: "" },
      achievements: { type: String, default: "" },
      downloads: { type: String, default: "" },
      faq: { type: String, default: "" },
      contact: { type: String, default: "" },
      defaultBanner: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteSetting", siteSettingSchema);