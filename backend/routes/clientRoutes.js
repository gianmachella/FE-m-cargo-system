const express = require("express");
const {
  createClient,
  getAllClients,
  getClientById,
  searchClients,
} = require("../controllers/clientController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create", authMiddleware, createClient);
router.get("/", authMiddleware, getAllClients);
router.get("/:id", authMiddleware, getClientById);
router.get("/search", authMiddleware, searchClients);

module.exports = router;
