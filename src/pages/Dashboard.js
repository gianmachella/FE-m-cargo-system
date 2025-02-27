import "./Dashboard.css";

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
