const express = require("express");
const { createReceiver } = require("../controllers/receptorController");

const router = express.Router();

// Ruta para crear un receptor
router.post("/", createReceiver);

module.exports = router;
