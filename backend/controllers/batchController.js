const Batch = require("../models/Batch");

// Get all batches with pagination, search, and filtering
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.findAll();
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new batch
const createBatch = async (req, res) => {
  try {
    const newBatch = await Batch.create(req.body);
    res.status(201).json(newBatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a batch by ID
const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.update(req.body);
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a batch by ID
const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.destroy();
    res.json({ message: "Batch deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get batches by shipment ID
const getBatchByShipment = async (req, res) => {
  try {
    const { shipmentId } = req.params;
    const batches = await Batch.findAll({ where: { shipmentId } });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export all the functions to be used in the routes
module.exports = {
  getBatches,
  createBatch,
  updateBatch,
  deleteBatch,
  getBatchByShipment,
};
