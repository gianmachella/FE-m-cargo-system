const db = require("../utils/db");

class User {
  static create(userData, callback) {
    const { email, password, role } = userData;
    const query = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
    db.query(query, [email, password, role], callback);
  }

  static findByEmail(email, callback) {
    const query = `SELECT * FROM users WHERE email = ?`;
    db.query(query, [email], callback);
  }
}

module.exports = User;
