const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { sequelize, connectDB } = require("./config/db");

// Importar rutas
const clientRoutes = require("./routes/clientRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const batchRoutes = require("./routes/batchRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const receiverRoutes = require("./routes/receiverRoutes");

// Configuración de entorno
dotenv.config();

const app = express();

// Conectar a la base de datos
connectDB();

// Importar asociaciones entre modelos
require("./models/associations");

// Sincronizar base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Sincroniza los modelos
    console.log("Database synchronized");
  } catch (error) {
    console.error("Error synchronizing the database:", error.message);
  }
};

syncDatabase();

// Habilitar CORS y parseo de JSON
app.use(cors());
app.use(express.json());

// Usar rutas
app.use("/api/clients", clientRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/receivers", receiverRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
