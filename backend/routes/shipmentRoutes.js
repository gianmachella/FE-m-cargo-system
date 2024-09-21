const express = require("express");
const {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipmentStatus,
} = require("../controllers/shipmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, createShipment);
router.get("/", authMiddleware, getAllShipments);
router.get("/:id", authMiddleware, getShipmentById);
router.put("/:id/status", authMiddleware, updateShipmentStatus);

module.exports = router;
