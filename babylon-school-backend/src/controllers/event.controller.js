const Event = require("../models/event.model");
const { uploadToCloudinary } = require("../services/storage.service");

// ======================================================
// GET ALL EVENTS
// GET /api/v1/events
// Public
// ======================================================
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({
      isActive: true,
    }).sort({
      eventDate: 1,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const mongoose = require("mongoose");

// ======================================================
// GET SINGLE EVENT
// GET /api/v1/events/:id
// Public
// ======================================================
const getEvent = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const filter = isObjectId
      ? { $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true }
      : { slug: req.params.id, isActive: true };

    const event = await Event.findOne(filter);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Get event error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
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
// CREATE EVENT
// POST /api/v1/events
// Protected
// ======================================================
const createEvent = async (req, res) => {
  try {
    const {
      title,
      slug,
      shortDescription,
      description,
      eventDate,
      startTime,
      endTime,
      location,
      category,
      isFeatured,
      isActive,
    } = req.body;

    let imageUrl;

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer,
        "babylon-school/events"
      );

      imageUrl = uploadedImage.url;
    }

    if (!title || !slug || !description || !eventDate) {
      return res.status(400).json({
        success: false,
        message:
          "Title, slug, description and event date are required",
      });
    }

    const existingEvent = await Event.findOne({ slug });

    if (existingEvent) {
      return res.status(400).json({
        success: false,
        message: "Event with this slug already exists",
      });
    }

    const event = await Event.create({
      title,
      slug,
      shortDescription,
      description,
      image: imageUrl,
      eventDate,
      startTime,
      endTime,
      location,
      category,
      isFeatured,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);

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
        message: "Event with this slug already exists",
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
// UPDATE EVENT
// PUT /api/v1/events/:id
// Protected
// ======================================================
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (req.body.slug && req.body.slug !== event.slug) {
      const existingEvent = await Event.findOne({
        slug: req.body.slug,
        _id: { $ne: req.params.id },
      });

      if (existingEvent) {
        return res.status(400).json({
          success: false,
          message: "Event with this slug already exists",
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
        "babylon-school/events"
      );

      payload.image = uploadedImage.url;
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
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
        message: "Event with this slug already exists",
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
// DELETE EVENT
// DELETE /api/v1/events/:id
// Protected
// ======================================================
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
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
// TOGGLE EVENT STATUS
// PATCH /api/v1/events/:id/status
// Protected
// ======================================================
const toggleEventStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.isActive = !event.isActive;

    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${
        event.isActive ? "activated" : "deactivated"
      } successfully`,
      data: event,
    });
  } catch (error) {
    console.error("Toggle event status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
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
// PATCH /api/v1/events/:id/featured
// Protected
// ======================================================
const toggleFeaturedStatus = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.isFeatured = !event.isFeatured;

    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${
        event.isFeatured
          ? "marked as featured"
          : "removed from featured"
      } successfully`,
      data: event,
    });
  } catch (error) {
    console.error("Toggle featured status error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
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
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventStatus,
  toggleFeaturedStatus,
};