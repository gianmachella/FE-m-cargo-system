const Client = require("./Client");
const Shipment = require("./Shipment");

// Asociaciones
Client.hasMany(Shipment, {
  as: "shipments",
  foreignKey: "clientId",
  onDelete: "CASCADE", // Si se elimina un cliente, se eliminan sus envíos
});
Shipment.belongsTo(Client, {
  as: "client",
  foreignKey: "clientId",
  onDelete: "CASCADE", // Elimina automáticamente si el cliente asociado es eliminado
});

// Exportar modelos con asociaciones
module.exports = { Client, Shipment };
