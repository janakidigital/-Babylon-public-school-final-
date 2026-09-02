const ECA = require("../models/eca.model");
const { uploadToCloudinary } = require("../services/storage.service");

function normalizeImageList(images) {
  if (!Array.isArray(images)) return [];
  return images
    .map((img) => {
      if (typeof img === "string" && img.trim()) {
        return { url: img.trim(), caption: "" };
      }
      const url = img?.url ? String(img.url).trim() : "";
      if (!url) return null;
      return { url, caption: img.caption ? String(img.caption) : "" };
    })
    .filter(Boolean);
}

async function uploadEcaFiles(files) {
  const uploadedImages = [];
  for (const file of files) {
    const result = await uploadToCloudinary(
      file.buffer,
      "babylon-school/eca",
      file.mimetype
    );
    if (result?.url) {
      uploadedImages.push({
        url: result.url,
        caption: "",
      });
    }
  }
  return uploadedImages;
}

// ======================================================
// GET ALL ECA ITEMS
// ======================================================
const getEcaItems = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    // For non-authenticated requests or unless explicitly asking for all
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "superAdmin")) {
      filter.isActive = true;
    }

    const items = await ECA.find(filter).sort({
      displayOrder: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Get ECA error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE ECA ITEM
// ======================================================
const getEcaItem = async (req, res) => {
  try {
    const item = await ECA.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "ECA item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Get ECA item error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ECA ID",
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
// CREATE ECA ITEM (with multi-image upload support)
// ======================================================
const createEcaItem = async (req, res) => {
  try {
    const {
      title,
      category,
      shortDescription,
      description,
      tags,
      displayOrder,
      isFeatured,
      isActive,
    } = req.body;

    const files = req.files || [];

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "ECA Title is required",
      });
    }

    const uploadedImages = await uploadEcaFiles(files);

    // Process tags
    let processedTags = [];
    if (tags) {
      if (Array.isArray(tags)) {
        processedTags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        processedTags = tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    const ecaDoc = new ECA({
      title: title.trim(),
      category: category || "Enhancing ECA",
      shortDescription: shortDescription ? shortDescription.trim() : "",
      description: description != null ? String(description) : "",
      coverImage: uploadedImages.length > 0 ? uploadedImages[0].url : "",
      images: uploadedImages,
      tags: processedTags,
      displayOrder: Number(displayOrder) || 0,
      isFeatured: isFeatured === "true" || isFeatured === true,
      isActive: isActive === undefined ? true : isActive === "true" || isActive === true,
    });

    await ecaDoc.save();

    res.status(201).json({
      success: true,
      message: "ECA item created successfully",
      data: ecaDoc,
    });
  } catch (error) {
    console.error("Create ECA error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create ECA item",
    });
  }
};

// ======================================================
// UPDATE ECA ITEM
// ======================================================
const updateEcaItem = async (req, res) => {
  try {
    const item = await ECA.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "ECA item not found",
      });
    }

    const {
      title,
      category,
      shortDescription,
      description,
      tags,
      displayOrder,
      isFeatured,
      isActive,
      existingImages,
    } = req.body;

    const files = req.files || [];

    let preservedImages = [];
    if (existingImages) {
      try {
        const parsed =
          typeof existingImages === "string"
            ? JSON.parse(existingImages)
            : existingImages;
        preservedImages = normalizeImageList(parsed);
      } catch (e) {
        preservedImages = normalizeImageList(item.images);
      }
    } else if (files.length === 0) {
      preservedImages = normalizeImageList(item.images);
    }

    const newImages = await uploadEcaFiles(files);
    const allImages = [...preservedImages, ...newImages];

    if (title) item.title = title.trim();
    if (category) item.category = category;
    if (shortDescription !== undefined) item.shortDescription = shortDescription.trim();
    if (description !== undefined) item.description = String(description);
    if (displayOrder !== undefined) item.displayOrder = Number(displayOrder) || 0;
    if (isFeatured !== undefined) item.isFeatured = isFeatured === "true" || isFeatured === true;
    if (isActive !== undefined) item.isActive = isActive === "true" || isActive === true;

    if (tags !== undefined) {
      if (Array.isArray(tags)) {
        item.tags = tags.map((t) => String(t).trim()).filter(Boolean);
      } else if (typeof tags === "string") {
        item.tags = tags.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    item.images = allImages;
    if (allImages.length > 0) {
      item.coverImage = allImages[0].url;
    }

    await item.save();

    res.status(200).json({
      success: true,
      message: "ECA item updated successfully",
      data: item,
    });
  } catch (error) {
    console.error("Update ECA error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update ECA item",
    });
  }
};

// ======================================================
// DELETE ECA ITEM
// ======================================================
const deleteEcaItem = async (req, res) => {
  try {
    const item = await ECA.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "ECA item not found",
      });
    }

    await ECA.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "ECA item deleted successfully",
    });
  } catch (error) {
    console.error("Delete ECA error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// ======================================================
// TOGGLE STATUS
// ======================================================
const toggleEcaStatus = async (req, res) => {
  try {
    const item = await ECA.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "ECA item not found" });
    }
    item.isActive = !item.isActive;
    await item.save();
    res.status(200).json({
      success: true,
      message: `ECA item ${item.isActive ? "activated" : "deactivated"}`,
      data: item,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEcaItems,
  getEcaItem,
  createEcaItem,
  updateEcaItem,
  deleteEcaItem,
  toggleEcaStatus,
};
