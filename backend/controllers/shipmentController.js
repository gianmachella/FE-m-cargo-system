const Shipment = require("../models/Shipment");

// Get all shipments with pagination, search and filtering
const getShipments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const offset = (page - 1) * limit;
    const whereCondition = search
      ? {
          [Op.or]: [
            { shipmentNumber: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const shipments = await Shipment.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      totalItems: shipments.count,
      totalPages: Math.ceil(shipments.count / limit),
      currentPage: parseInt(page),
      data: shipments.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new shipment
const createShipment = async (req, res) => {
  try {
    const {
      shipmentNumber,
      batchId,
      boxes,
      totalWeight,
      totalVolume,
      totalBoxes,
      status,
      createdBy,
      senderUserId,
      receiver,
    } = req.body;
    const newShipment = await Shipment.create({
      shipmentNumber,
      batchId,
      boxes,
      totalWeight,
      totalVolume,
      totalBoxes,
      status,
      createdBy,
      updatedBy: createdBy,
      senderUserId,
      receiver,
    });
    res.json(newShipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update shipment by ID
const updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      shipmentNumber,
      batchId,
      boxes,
      totalWeight,
      totalVolume,
      totalBoxes,
      status,
      updatedBy,
    } = req.body;

    const shipment = await Shipment.findByPk(id);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    shipment.shipmentNumber = shipmentNumber;
    shipment.batchId = batchId;
    shipment.boxes = boxes;
    shipment.totalWeight = totalWeight;
    shipment.totalVolume = totalVolume;
    shipment.totalBoxes = totalBoxes;
    shipment.status = status;
    shipment.updatedBy = updatedBy;

    await shipment.save();
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete shipment by ID
const deleteShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const shipment = await Shipment.findByPk(id);
    if (!shipment)
      return res.status(404).json({ message: "Shipment not found" });

    await shipment.destroy();
    res.json({ message: "Shipment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShipmentsByBatch = async (req, res) => {
  try {
    const { batchId } = req.params; // ID del lote
    const batch = await Batch.findByPk(batchId, {
      include: {
        model: Shipment,
        as: "shipments",
      },
    });
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    res.json(batch.shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShipments,
  createShipment,
  updateShipment,
  deleteShipment,
  getShipmentsByBatch,
};
