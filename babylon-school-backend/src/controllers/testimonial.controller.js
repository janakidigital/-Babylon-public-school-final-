const Testimonial = require("../models/testimonial.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL TESTIMONIALS
// GET /api/v1/testimonials
// Public
// ======================================================
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({
      isActive: true,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error("Get testimonials error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE TESTIMONIAL
// GET /api/v1/testimonials/:id
// Public
// ======================================================
const getTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error("Get testimonial error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// CREATE TESTIMONIAL
// POST /api/v1/testimonials
// Protected
// ======================================================
const createTestimonial = async (req, res) => {
  try {
    const {
      name,
      designation,
      message,
      rating,
      category,
      isFeatured,
      isActive,
    } = req.body;

    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/testimonials"
      );

      imageUrl = uploadedImage.url;
    }

    // Required fields
    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "Name and message are required",
      });
    }

    // Rating validation
    if (
      rating !== undefined &&
      (Number(rating) < 1 || Number(rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const testimonial = await Testimonial.create({
      name,
      designation,
      message,
      image: imageUrl,
      rating,
      category,
      isFeatured,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Testimonial created successfully",
      data: testimonial,
    });
  } catch (error) {
    console.error("Create testimonial error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE TESTIMONIAL
// PUT /api/v1/testimonials/:id
// Protected
// ======================================================
const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    // Rating validation
    if (
      req.body.rating !== undefined &&
      (Number(req.body.rating) < 1 ||
        Number(req.body.rating) > 5)
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const payload = {
      ...req.body,
    };

    delete payload.image;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/testimonials"
      );

      payload.image = uploadedImage.url;
    }

    const updatedTestimonial =
      await Testimonial.findByIdAndUpdate(
        req.params.id,
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

    res.status(200).json({
      success: true,
      message: "Testimonial updated successfully",
      data: updatedTestimonial,
    });
  } catch (error) {
    console.error("Update testimonial error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE TESTIMONIAL
// DELETE /api/v1/testimonials/:id
// Protected
// ======================================================
const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await Testimonial.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    console.error("Delete testimonial error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE TESTIMONIAL STATUS
// PATCH /api/v1/testimonials/:id/status
// Protected
// ======================================================
const toggleTestimonialStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.isActive = !testimonial.isActive;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${
        testimonial.isActive
          ? "activated"
          : "deactivated"
      } successfully`,
      data: testimonial,
    });
  } catch (error) {
    console.error(
      "Toggle testimonial status error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE FEATURED STATUS
// PATCH /api/v1/testimonials/:id/featured
// Protected
// ======================================================
const toggleFeaturedStatus = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(
      req.params.id
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    testimonial.isFeatured = !testimonial.isFeatured;

    await testimonial.save();

    res.status(200).json({
      success: true,
      message: `Testimonial ${
        testimonial.isFeatured
          ? "marked as featured"
          : "removed from featured"
      } successfully`,
      data: testimonial,
    });
  } catch (error) {
    console.error(
      "Toggle testimonial featured error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid testimonial ID",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  toggleFeaturedStatus,
};