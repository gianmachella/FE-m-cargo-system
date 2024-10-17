const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const Client = require("./Client"); // Importar el modelo de cliente

const Shipment = sequelize.define("Shipment", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  shipmentNumber: { type: DataTypes.STRING, allowNull: false },
  clientId: { type: DataTypes.INTEGER, allowNull: true }, // FK hacia Client
  totalWeight: { type: DataTypes.FLOAT, allowNull: false },
  totalVolume: { type: DataTypes.FLOAT, allowNull: false },
  totalBoxes: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  senderUserId: { type: DataTypes.INTEGER, allowNull: false },
  receiver: { type: DataTypes.JSON, allowNull: false },
});

// Relación: Un envío pertenece a un cliente
Shipment.belongsTo(Client, { as: "client", foreignKey: "clientId" });

module.exports = Shipment;
