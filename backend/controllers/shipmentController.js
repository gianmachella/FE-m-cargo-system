const Client = require("../models/Client");
const Shipment = require("../models/Shipment");
const Batch = require("../models/Batch");
const { sequelize } = require("../config/db");
const { Op } = require("sequelize");

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
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "firstName", "lastName", "phone", "email"],
        },
      ],
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

const createShipment = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    console.log(req.body);

    const {
      shipmentNumber,
      batchId,
      clientId,
      receiverId,
      boxes,
      totalWeight,
      totalVolume,
      totalBoxes,
      status,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
      insurance,
      paymentMethod,
      declaredValue,
      valuePaid,
    } = req.body;

    const newShipment = await Shipment.create(
      {
        shipmentNumber,
        batchId,
        clientId,
        receiverId,
        boxes,
        totalWeight,
        totalVolume,
        totalBoxes,
        status,
        createdBy,
        updatedBy,
        createdAt,
        updatedAt,
        insurance,
        paymentMethod,
        declaredValue,
        valuePaid,
      },
      { transaction }
    );

    const client = await Client.findByPk(clientId, {
      include: [{ model: Shipment, as: "shipments" }],
    });

    const updatedShipments = client.shipments
      ? [...client.shipments, shipmentNumber]
      : [shipmentNumber];
    await client.update({ shipments: updatedShipments }, { transaction });

    const batch = await Batch.findByPk(batchId, { transaction });
    const updatedBatchShipments = batch.shipments
      ? [...batch.shipments, shipmentNumber]
      : [shipmentNumber];
    await batch.update({ shipments: updatedBatchShipments }, { transaction });

    await transaction.commit();
    res.status(201).json(newShipment);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: error.message });
  }
};

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
    const { batchId } = req.params;
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
