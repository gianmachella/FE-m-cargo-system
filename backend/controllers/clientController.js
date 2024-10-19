const Client = require("../models/Client");
const Shipment = require("../models/Shipment");
const Receiver = require("../models/Receiver");
const { Op } = require("sequelize");

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
            { phone: { [Op.like]: `%${search}%` } }, // Búsqueda por teléfono
          ],
        }
      : {};

    const clients = await Client.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
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
  const { firstName, lastName, phone, email, receivers } = req.body;

  const transaction = await Client.sequelize.transaction();

  try {
    console.log("Datos recibidos:", req.body);

    // Crear cliente
    const newClient = await Client.create(
      { firstName, lastName, phone, email },
      { transaction }
    );
    console.log("Cliente creado:", newClient);

    // Crear receptores asociados
    if (receivers && receivers.length > 0) {
      const receiversData = receivers.map((receiver) => ({
        ...receiver,
        clientId: newClient.id,
      }));
      console.log("Datos de receptores:", receiversData);

      await Receiver.bulkCreate(receiversData, { transaction });
      console.log("Receptores creados con éxito.");
    }

    await transaction.commit();
    res.status(201).json({ message: "Cliente y receptores creados con éxito" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear cliente:", error);
    res.status(500).json({
      message: "Error al crear el cliente.",
      error: error.message,
    });
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

const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findByPk(id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClientWithReceivers = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phone, email, receivers } = req.body;

  const transaction = await sequelize.transaction(); // Usa sequelize aquí
  try {
    const client = await Client.findByPk(id);
    if (!client) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    client.firstName = firstName;
    client.lastName = lastName;
    client.phone = phone;
    client.email = email;
    await client.save({ transaction });

    if (receivers && receivers.length > 0) {
      for (const receiverData of receivers) {
        const { id: receiverId, ...updatedData } = receiverData;
        const receiver = await Receiver.findByPk(receiverId);

        if (receiver) {
          await receiver.update(updatedData, { transaction });
        } else {
          await Receiver.create(
            { ...updatedData, clientId: id },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();
    res
      .status(200)
      .json({ message: "Cliente y receptores actualizados con éxito" });
  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar cliente y receptores:", error);
    res
      .status(500)
      .json({ message: "Error al actualizar cliente y receptores" });
  }
};

module.exports = {
  getClientById,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getShipmentsByClient,
  updateClientWithReceivers,
};
