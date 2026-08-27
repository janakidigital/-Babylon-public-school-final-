const express = require("express");
const {
  getPosters,
  createPoster,
  updatePoster,
  deletePoster,
} = require("../controllers/poster.controller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

router.get("/", getPosters);
router.post("/", protect, upload.single("image"), createPoster);
router.put("/:id", protect, upload.single("image"), updatePoster);
router.delete("/:id", protect, deletePoster);

module.exports = router;