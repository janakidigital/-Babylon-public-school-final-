const News = require("../models/news.model");
const Notice = require("../models/notice.model");
const Event = require("../models/event.model");
const Program = require("../models/program.model");
const Gallery = require("../models/gallery.model");

// Simple global search across several collections
const globalSearch = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(400).json({ success: false, message: "Query (q) is required" });

    const regex = new RegExp(q, "i");

    const [news, notices, events, programs, galleries] = await Promise.all([
      News.find({
        isActive: true,
        $or: [{ title: regex }, { shortDescription: regex }, { content: regex }],
      }).limit(10),
      Notice.find({ isActive: true, $or: [{ title: regex }, { content: regex }] }).limit(10),
      Event.find({ isActive: true, $or: [{ title: regex }, { description: regex }] }).limit(10),
      Program.find({ isActive: true, $or: [{ title: regex }, { description: regex }] }).limit(10),
      Gallery.find({ isActive: true, $or: [{ title: regex }, { description: regex }] }).limit(10),
    ]);

    const results = [];

    news.forEach(n => results.push({ type: "news", data: n }));
    notices.forEach(n => results.push({ type: "notice", data: n }));
    events.forEach(e => results.push({ type: "event", data: e }));
    programs.forEach(p => results.push({ type: "program", data: p }));
    galleries.forEach(g => results.push({ type: "gallery", data: g }));

    res.status(200).json({ success: true, count: results.length, data: results });
  } catch (error) {
    console.error("Global search error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { globalSearch };
