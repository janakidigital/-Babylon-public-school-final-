const express = require("express");
const {
  getPosters,
  createPoster,
  updatePoster,
  deletePoster,
} = require("../controllers/poster.controller");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getPosters);
router.post("/", protect, authorize("admin", "superAdmin"), upload.single("image"), createPoster);
router.put("/:id", protect, authorize("admin", "superAdmin"), upload.single("image"), updatePoster);
router.delete("/:id", protect, authorize("admin", "superAdmin"), deletePoster);

module.exports = router;