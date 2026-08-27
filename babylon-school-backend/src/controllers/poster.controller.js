const Poster = require("../models/poster.model");
const { uploadToCloudinary } = require("../services/storage.service");

const getPosters = async (req, res) => {
  try {
    const posters = await Poster.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: posters });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get posters",
      error: error.message,
    });
  }
};

const createPoster = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/posters"
      );
      payload.image = uploaded.url;
    }

    if (payload.isActive !== undefined) {
      payload.isActive =
        payload.isActive === "true" || payload.isActive === true;
    }

    const poster = await Poster.create(payload);

    res.status(201).json({
      success: true,
      message: "Poster created successfully",
      data: poster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create poster",
      error: error.message,
    });
  }
};

const updatePoster = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/posters"
      );
      payload.image = uploaded.url;
    }

    if (payload.isActive !== undefined) {
      payload.isActive =
        payload.isActive === "true" || payload.isActive === true;
    }

    const poster = await Poster.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Poster updated successfully",
      data: poster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update poster",
      error: error.message,
    });
  }
};

const deletePoster = async (req, res) => {
  try {
    const poster = await Poster.findByIdAndDelete(req.params.id);

    if (!poster) {
      return res.status(404).json({
        success: false,
        message: "Poster not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Poster deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete poster",
      error: error.message,
    });
  }
};

module.exports = {
  getPosters,
  createPoster,
  updatePoster,
  deletePoster,
};