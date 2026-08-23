const express = require("express");

const router = express.Router();

const {
  getAdmissions,
  getAdmission,
  submitAdmission,
  updateAdmission,
  updateAdmissionStatus,
  deleteAdmission,
} = require("../controllers/admission.controller");

const { protect } = require("../middleware/auth");

// ======================================================
// PUBLIC
// ======================================================

router.post("/", submitAdmission);


// ======================================================
// PROTECTED
// ======================================================

router.get("/", protect, getAdmissions);

router.get("/:id", protect, getAdmission);

router.put("/:id", protect, updateAdmission);

router.patch(
  "/:id/status",
  protect,
  updateAdmissionStatus
);

router.delete(
  "/:id",
  protect,
  deleteAdmission
);

module.exports = router;
