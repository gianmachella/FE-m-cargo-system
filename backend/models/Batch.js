const db = require("../utils/db");

class Batch {
  static create(batchData, callback) {
    const { number, destination, type, userId } = batchData;
    const query = `INSERT INTO batches (number, destination, type, created_at, user_id) VALUES (?, ?, ?, NOW(), ?)`;
    db.query(query, [number, destination, type, userId], callback);
  }

  static findAll(callback) {
    const query = `SELECT * FROM batches ORDER BY created_at DESC`;
    db.query(query, callback);
  }

  static findById(id, callback) {
    const query = `SELECT * FROM batches WHERE id = ?`;
    db.query(query, [id], callback);
  }
}

module.exports = Batch;
