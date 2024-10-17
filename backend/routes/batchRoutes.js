const express = require("express");
const {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchByShipment,
} = require("../controllers/batchController"); // Verificar que estas funciones existan y se estén exportando correctamente
const { protect } = require("../middlewares/authMiddleware");
const { validatePagination } = require("../middlewares/validatePagination");
const router = express.Router();

router
  .route("/")
  .get(protect, validatePagination, getBatches) // Verificar que getBatches no sea undefined
  .post(protect, createBatch);

router.route("/:id").put(protect, updateBatch).delete(protect, deleteBatch);

router
  .route("/shipment/:shipmentId")
  .get(protect, validatePagination, getBatchByShipment);

module.exports = router;
