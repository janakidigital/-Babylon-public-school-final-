const Program = require("../models/program.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL PROGRAMS
// GET /api/v1/programs
// Public
// ======================================================
const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({ isActive: true })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs,
    });
  } catch (error) {
    console.error("Get programs error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE PROGRAM
// GET /api/v1/programs/:id
// Public
// ======================================================
const getProgram = async (req, res) => {
  try {
    const program = await Program.findOne({
      _id: req.params.id,
      isActive: true,
    });

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    res.status(200).json({
      success: true,
      data: program,
    });
  } catch (error) {
    console.error("Get program error:", error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID",
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
// CREATE PROGRAM
// POST /api/v1/programs
// Protected
// ======================================================
const createProgram = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      duration,
      level,
      eligibility,
      highlights,
      careerOpportunities,
      isFeatured,
      isActive,
    } = req.body;

    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/programs"
      );

      imageUrl = uploadedImage.url;
    }

    // Check required fields
    if (!title || !slug || !description) {
      return res.status(400).json({
        success: false,
        message: "Title, slug and description are required",
      });
    }

    // Check duplicate slug
    const existingProgram = await Program.findOne({ slug });

    if (existingProgram) {
      return res.status(400).json({
        success: false,
        message: "A program with this slug already exists",
      });
    }

    const program = await Program.create({
      title,
      slug,
      shortDescription,
      description,
      image: imageUrl,
      duration,
      level,
      eligibility,
      highlights,
      careerOpportunities,
      isFeatured,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Program created successfully",
      data: program,
    });
  } catch (error) {
    console.error("Create program error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map(
          (err) => err.message
        ),
      });
    }

    // Duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A program with this slug already exists",
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
// UPDATE PROGRAM
// PUT /api/v1/programs/:id
// Protected
// ======================================================
const updateProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    // If slug is being changed, check duplicate
    if (req.body.slug && req.body.slug !== program.slug) {
      const existingProgram = await Program.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id },
      });

      if (existingProgram) {
        return res.status(400).json({
          success: false,
          message: "A program with this slug already exists",
        });
      }
    }

    const payload = {
      ...req.body,
    };

    delete payload.image;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/programs"
      );

      payload.image = uploadedImage.url;
    }

    const updatedProgram = await Program.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Program updated successfully",
      data: updatedProgram,
    });
  } catch (error) {
    console.error("Update program error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID",
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

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A program with this slug already exists",
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
// DELETE PROGRAM
// DELETE /api/v1/programs/:id
// Protected
// ======================================================
const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    await Program.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Program deleted successfully",
    });
  } catch (error) {
    console.error("Delete program error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID",
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
// TOGGLE PROGRAM STATUS
// PATCH /api/v1/programs/:id/status
// Protected
// ======================================================
const toggleProgramStatus = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    program.isActive = !program.isActive;

    await program.save();

    res.status(200).json({
      success: true,
      message: `Program ${
        program.isActive ? "activated" : "deactivated"
      } successfully`,
      data: program,
    });
  } catch (error) {
    console.error("Toggle program status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID",
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
// PATCH /api/v1/programs/:id/featured
// Protected
// ======================================================
const toggleFeaturedStatus = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (!program) {
      return res.status(404).json({
        success: false,
        message: "Program not found",
      });
    }

    program.isFeatured = !program.isFeatured;

    await program.save();

    res.status(200).json({
      success: true,
      message: `Program ${
        program.isFeatured ? "marked as featured" : "removed from featured"
      } successfully`,
      data: program,
    });
  } catch (error) {
    console.error("Toggle featured status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid program ID",
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
  getPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram,
  toggleProgramStatus,
  toggleFeaturedStatus,
};