const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    careerTitle: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    coverLetter: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    status: { type: String, trim: true, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerApplication", applicationSchema);
