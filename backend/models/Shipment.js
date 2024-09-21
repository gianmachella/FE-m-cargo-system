const db = require("../utils/db");

class Shipment {
  static create(shipmentData, callback) {
    const {
      shipmentNumber,
      batchId,
      clientId,
      receiverId,
      boxes,
      status,
      userId,
    } = shipmentData;
    const query = `INSERT INTO shipments (shipment_number, batch_id, client_id, receiver_id, boxes, status, created_at, user_id) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)`;
    db.query(
      query,
      [
        shipmentNumber,
        batchId,
        clientId,
        receiverId,
        JSON.stringify(boxes),
        status,
        userId,
      ],
      callback
    );
  }

  static findAll(callback) {
    const query = `SELECT * FROM shipments ORDER BY created_at DESC`;
    db.query(query, callback);
  }

  static findById(id, callback) {
    const query = `SELECT * FROM shipments WHERE id = ?`;
    db.query(query, [id], callback);
  }

  static updateStatus(id, status, callback) {
    const query = `UPDATE shipments SET status = ? WHERE id = ?`;
    db.query(query, [status, id], callback);
  }
}

module.exports = Shipment;
