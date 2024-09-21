const Client = require("../models/Client");

exports.createClient = (req, res) => {
  const { firstName, lastName, phone, email } = req.body;
  const userId = req.user.id; // El id del usuario logueado se obtiene del middleware de autenticación

  Client.create(
    { firstName, lastName, phone, email, userId },
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error creating client" });
      res.status(201).json({
        message: "Client created successfully",
        clientId: result.insertId,
      });
    }
  );
};

exports.getAllClients = (req, res) => {
  Client.findAll((err, results) => {
    if (err) return res.status(500).json({ message: "Error fetching clients" });
    res.status(200).json(results);
  });
};

exports.getClientById = (req, res) => {
  const { id } = req.params;

  Client.findById(id, (err, result) => {
    if (err || result.length === 0)
      return res.status(404).json({ message: "Client not found" });
    res.status(200).json(result[0]);
  });
};

exports.searchClients = (req, res) => {
  const { term } = req.query;

  Client.findBySearchTerm(term, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Error searching clients" });
    res.status(200).json(results);
  });
};
