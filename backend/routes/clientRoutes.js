const express = require("express");
const {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getShipmentsByClient,
} = require("../controllers/clientController");
const { protect } = require("../middlewares/authMiddleware");
const { validatePagination } = require("../middlewares/validatePagination"); // Asegúrate de que esta importación sea correcta

const router = express.Router();

router
  .route("/")
  .get(protect, validatePagination, getClients) // Utilizando validatePagination como middleware
  .post(protect, createClient);

router.route("/:id").put(protect, updateClient).delete(protect, deleteClient);

router.route("/:id/shipments").get(protect, getShipmentsByClient);

module.exports = router;
