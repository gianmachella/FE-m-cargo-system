const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Importa la instancia correctamente
const Client = require("./Client"); // Importa el modelo de cliente

const Receiver = sequelize.define("Receiver", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Relación: Un cliente tiene muchos receptores
Client.hasMany(Receiver, { as: "receivers", foreignKey: "clientId" });
Receiver.belongsTo(Client, { foreignKey: "clientId" });

module.exports = Receiver;
