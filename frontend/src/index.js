import "./index.css";

import App from "./App";
import React from "react";
import { createRoot } from "react-dom/client";

// Obtener el elemento donde se montará la aplicación
const container = document.getElementById("root");

// Crear la raíz utilizando createRoot en lugar de ReactDOM.render
const root = createRoot(container);

// Renderizar la aplicación en la raíz creada
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
