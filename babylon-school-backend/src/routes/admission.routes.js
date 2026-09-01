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
const authorize = require("../middleware/authorize.middleware");

// ======================================================
// PUBLIC
// ======================================================

router.post("/", submitAdmission);


// ======================================================
// PROTECTED (Admin only)
// ======================================================

router.get("/", protect, authorize("admin", "superAdmin"), getAdmissions);

router.get("/:id", protect, authorize("admin", "superAdmin"), getAdmission);

router.put("/:id", protect, authorize("admin", "superAdmin"), updateAdmission);

router.patch(
  "/:id/status",
  protect,
  authorize("admin", "superAdmin"),
  updateAdmissionStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "superAdmin"),
  deleteAdmission
);

module.exports = router;
