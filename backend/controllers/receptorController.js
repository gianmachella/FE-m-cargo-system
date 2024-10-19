const Receiver = require("../models/Receiver");
// Asegúrate de que esta función esté definida correctamente
const getReceptorsByClientId = async (req, res) => {
  const { clientId } = req.params; // Extrae el ID del cliente desde los parámetros de la solicitud.

  try {
    const receivers = await Receiver.findAll({
      where: { clientId }, // Verifica que se esté usando el `clientId` como filtro.
    });

    if (receivers.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron receptores para este cliente." });
    }

    return res.status(200).json(receivers);
  } catch (error) {
    console.error("Error al obtener los receptores:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener los receptores." });
  }
};

const createReceiver = async (req, res) => {
  const { firstName, lastName, phone, address, country, clientId } = req.body;

  try {
    // Validamos los datos necesarios
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !country ||
      !clientId
    ) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios." });
    }

    // Creamos el receptor en la base de datos
    const newReceiver = await Receptor.create({
      firstName,
      lastName,
      phone,
      address,
      country,
      clientId,
    });

    return res.status(201).json(newReceiver); // Devolvemos el receptor creado
  } catch (error) {
    console.error("Error al crear el receptor:", error);
    return res.status(500).json({ message: "Error al crear el receptor." });
  }
};

const updateReceiver = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, phone, address, country } = req.body;

    const receiver = await Receiver.findByPk(id);
    if (!receiver) {
      return res.status(404).json({ message: "Receptor no encontrado" });
    }

    // Actualizamos los datos del receptor
    receiver.firstName = firstName;
    receiver.lastName = lastName;
    receiver.phone = phone;
    receiver.address = address;
    receiver.country = country;

    await receiver.save(); // Guardamos los cambios en la base de datos

    return res.status(200).json({ message: "Receptor actualizado", receiver });
  } catch (error) {
    console.error("Error al actualizar receptor:", error);
    return res.status(500).json({ message: "Error al actualizar receptor" });
  }
};

// Exportamos la función correctamente
module.exports = { getReceptorsByClientId, createReceiver, updateReceiver };
