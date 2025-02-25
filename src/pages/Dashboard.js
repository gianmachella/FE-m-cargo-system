import "./Dashboard.css"; // Asegúrate de tener los estilos de Dashboard aplicados

import { FormContainer, FormSection } from "../components/form/Form";

import Input from "../components/inputs/InputComponent";
import React from "react";
import logo from "../images/logos/logo-hor.png";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content">
        <h1>Bienvenidos</h1>
        <img src={logo} />
        <p>Selecciona una opción del menú para empezar.</p>
      </div>
    </div>
  );
};

export default Dashboard;
