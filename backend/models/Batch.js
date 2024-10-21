const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Batch = sequelize.define("Batch", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  batchNumber: { type: DataTypes.STRING, allowNull: false },
  shipments: { type: DataTypes.JSON, allowNull: true },
  destinationCountry: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  shipmentType: { type: DataTypes.STRING, allowNull: false }, // Asegúrate de esto
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
  updatedBy: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = Batch;
