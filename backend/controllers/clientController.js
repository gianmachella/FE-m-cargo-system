const Client = require("../models/Client");
const Shipment = require("../models/Shipment");
const Receiver = require("../models/Reciver");

// Get all clients with pagination, search and filtering
const getClients = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const offset = (page - 1) * limit;
    const whereCondition = search
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const clients = await Client.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: { model: Shipment, as: "shipments" },
    });

    res.json({
      totalItems: clients.count,
      totalPages: Math.ceil(clients.count / limit),
      currentPage: parseInt(page),
      data: clients.rows,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createClient = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      email,
      userId,
      password,
      createdBy,
      receivers,
    } = req.body;

    // Crear el cliente
    const newClient = await Client.create({
      firstName,
      lastName,
      phone,
      email,
      userId,
      password,
      createdBy,
      updatedBy: createdBy,
    });

    // Si hay receptores, crearlos y asociarlos al cliente
    if (receivers && receivers.length > 0) {
      const newReceivers = receivers.map((receiver) => ({
        ...receiver, // Contiene firstName, lastName, phone, address, country
        clientId: newClient.id, // Asocia el receptor al cliente recién creado
      }));
      await Receiver.bulkCreate(newReceivers);
    }

    res.json(newClient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update client by ID
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, email, updatedBy } = req.body;

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    client.firstName = firstName;
    client.lastName = lastName;
    client.phone = phone;
    client.email = email;
    client.updatedBy = updatedBy;

    await client.save();
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete client by ID
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    await client.destroy();
    res.json({ message: "Client deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getShipmentsByClient = async (req, res) => {
  try {
    const { id } = req.params; // ID del cliente
    const client = await Client.findByPk(id, {
      include: {
        model: Shipment,
        as: "shipments", // Nombre del alias definido en la relación
      },
    });
    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json(client.shipments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getShipmentsByClient,
};
