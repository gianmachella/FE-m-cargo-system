const express = require("express");
const {
  createBatch,
  getAllBatches,
  getBatchById,
} = require("../controllers/batchController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, createBatch);
router.get("/", authMiddleware, getAllBatches);
router.get("/:id", authMiddleware, getBatchById);

module.exports = router;
