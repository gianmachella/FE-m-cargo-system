const Batch = require("../models/Batch");

exports.createBatch = (req, res) => {
  const { number, destination, type } = req.body;
  const userId = req.user.id; // El id del usuario logueado se obtiene del middleware de autenticación

  Batch.create({ number, destination, type, userId }, (err, result) => {
    if (err) return res.status(500).json({ message: "Error creating batch" });
    res.status(201).json({
      message: "Batch created successfully",
      batchId: result.insertId,
    });
  });
};

exports.getAllBatches = (req, res) => {
  Batch.findAll((err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching batches" });
    res.status(200).json(results);
  });
};

exports.getBatchById = (req, res) => {
  const { id } = req.params;

  Batch.findById(id, (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ message: "Batch not found" });
    res.status(200).json(result[0]);
  });
};
