import "./Dashboard.css"; // Asegúrate de tener los estilos de Dashboard aplicados

import { FormContainer, FormSection } from "../components/form/Form";

import Input from "../components/inputs/InputComponent";
import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="content">
        <h1>Bienvenido al Sistema M-Cargo</h1>
        <p>Selecciona una opción del menú para empezar.</p>
        <FormContainer>
          <FormSection title="Datos personales">
            <Input label="Prueba" borderRadius={5} placeholder={"Escrime"} />
            <Input label="Prueba" borderRadius={5} placeholder={"Escrime"} />
            <Input label="Prueba" borderRadius={5} placeholder={"Escrime"} />
            <Input label="Prueba" borderRadius={5} placeholder={"Escrime"} />
          </FormSection>
        </FormContainer>
      </div>
    </div>
  );
};

export default Dashboard;
