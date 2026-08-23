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

// ======================================================
// PUBLIC
// ======================================================

router.post("/", submitContact);


// ======================================================
// PROTECTED
// ======================================================

router.get("/", protect, getContacts);

router.get("/:id", protect, getContact);

router.put("/:id", protect, updateContact);

router.patch(
  "/:id/status",
  protect,
  updateContactStatus
);

router.delete(
  "/:id",
  protect,
  deleteContact
);

module.exports = router;
