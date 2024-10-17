const Client = require("./Client");
const Shipment = require("./Shipment");

// Definir las relaciones
Client.hasMany(Shipment, { foreignKey: "clientId", as: "shipments" });
Shipment.belongsTo(Client, { foreignKey: "clientId", as: "client" });

module.exports = { Client, Shipment };
