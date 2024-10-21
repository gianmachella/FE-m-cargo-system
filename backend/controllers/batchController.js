const { Op } = require("sequelize");
const Batch = require("../models/Batch");

const getBatches = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const offset = (page - 1) * limit;

  try {
    // Condición para filtrar por número de lote, país de destino o tipo de envío
    const whereCondition = search
      ? {
          [Op.or]: [
            { batchNumber: { [Op.like]: `%${search}%` } },
            { destinationCountry: { [Op.like]: `%${search}%` } },
            { shipmentType: { [Op.like]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await Batch.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    res.json({
      data: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error al obtener los lotes:", error);
    res.status(500).json({ message: "Error al obtener los lotes" });
  }
};

// Crear un nuevo lote
const createBatch = async (req, res) => {
  try {
    const newBatch = await Batch.create(req.body);
    res.status(201).json(newBatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un lote por su ID
const getBatchById = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un lote por su ID
const updateBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.update(req.body);
    res.json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un lote por su ID
const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findByPk(id);

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    await batch.destroy();
    res.json({ message: "Batch deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBatches,
  createBatch,
  getBatchById,
  updateBatch,
  deleteBatch,
};
