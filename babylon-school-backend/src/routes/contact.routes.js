const express = require("express");

const router = express.Router();

const {
  getContacts,
  getContact,
  submitContact,
  updateContact,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contact.controller");

const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");

// ======================================================
// PUBLIC
// ======================================================

router.post("/", submitContact);


// ======================================================
// PROTECTED (Admin only)
// ======================================================

router.get("/", protect, authorize("admin", "superAdmin"), getContacts);

router.get("/:id", protect, authorize("admin", "superAdmin"), getContact);

router.put("/:id", protect, authorize("admin", "superAdmin"), updateContact);

router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superAdmin"),
  updateContactStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  deleteContact
);

module.exports = router;
