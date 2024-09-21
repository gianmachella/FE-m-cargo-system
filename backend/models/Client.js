const db = require("../utils/db");

class Client {
  static create(clientData, callback) {
    const { firstName, lastName, phone, email, userId } = clientData;
    const query = `INSERT INTO clients (first_name, last_name, phone, email, created_at, user_id) VALUES (?, ?, ?, ?, NOW(), ?)`;
    db.query(query, [firstName, lastName, phone, email, userId], callback);
  }

  static findAll(callback) {
    const query = `SELECT * FROM clients ORDER BY created_at DESC`;
    db.query(query, callback);
  }

  static findById(id, callback) {
    const query = `SELECT * FROM clients WHERE id = ?`;
    db.query(query, [id], callback);
  }

  static findBySearchTerm(term, callback) {
    const query = `SELECT * FROM clients WHERE first_name LIKE ? OR last_name LIKE ? OR phone LIKE ?`;
    const searchTerm = `%${term}%`;
    db.query(query, [searchTerm, searchTerm, searchTerm], callback);
  }
}

module.exports = Client;
