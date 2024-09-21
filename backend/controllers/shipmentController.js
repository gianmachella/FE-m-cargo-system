const Shipment = require("../models/Shipment");

exports.createShipment = (req, res) => {
  const { shipmentNumber, batchId, clientId, receiverId, boxes, status } =
    req.body;
  const userId = req.user.id; // El id del usuario logueado se obtiene del middleware de autenticación

  Shipment.create(
    { shipmentNumber, batchId, clientId, receiverId, boxes, status, userId },
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error creating shipment" });
      res.status(201).json({
        message: "Shipment created successfully",
        shipmentId: result.insertId,
      });
    }
  );
};

exports.getAllShipments = (req, res) => {
  Shipment.findAll((err, results) => {
    if (err)
      return res.status(500).json({ message: "Error fetching shipments" });
    res.status(200).json(results);
  });
};

exports.getShipmentById = (req, res) => {
  const { id } = req.params;

  Shipment.findById(id, (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ message: "Shipment not found" });
    res.status(200).json(result[0]);
  });
};

exports.updateShipmentStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  Shipment.updateStatus(id, status, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error updating shipment status" });
    res.status(200).json({ message: "Shipment status updated successfully" });
  });
};
