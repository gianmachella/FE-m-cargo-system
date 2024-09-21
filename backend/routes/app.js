const express = require("express");
const cors = require("cors");
const batchRoutes = require("./routes/batchRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/batches", batchRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
