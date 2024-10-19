const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Receiver = sequelize.define("Receiver", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
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
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Receiver;
