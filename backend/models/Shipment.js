const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importación correcta

const Shipment = sequelize.define("Shipment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  shipmentNumber: { type: DataTypes.STRING, allowNull: false },
  batchId: { type: DataTypes.INTEGER, allowNull: true },
  boxes: { type: DataTypes.JSON, allowNull: true }, // Array of boxes
  totalWeight: { type: DataTypes.FLOAT, allowNull: false },
  totalVolume: { type: DataTypes.FLOAT, allowNull: false },
  totalBoxes: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
  updatedBy: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  senderUserId: { type: DataTypes.INTEGER, allowNull: false },
  receiver: { type: DataTypes.JSON, allowNull: false }, // Receiver's full data in JSON
});

module.exports = Shipment;
