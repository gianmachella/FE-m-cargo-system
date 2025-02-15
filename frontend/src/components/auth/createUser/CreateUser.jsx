import { FormContainer, FormSection } from "../../form/Form";
import React, { useState } from "react";

import Button from "../../button/Button";
import Input from "../../inputs/InputComponent";
import Select from "../../select/SelectComponent";
import Swal from "sweetalert2";
import { companyOptions } from "../../../utilities/options";

const CreateUser = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 handleSubmit se ejecutó");

    if (
      !firstName ||
      !lastName ||
      !userName ||
      !email ||
      !password ||
      !company
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    const userData = {
      firstName,
      lastName,
      userName,
      email,
      password,
      company,
      createdBy: 1,
      updatedBy: 1,
    };

    console.log("📤 Enviando datos:", userData);

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 Respuesta recibida:", response);

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
        setFirstName("");
        setLastName("");
        setUserName("");
        setEmail("");
        setPassword("");
        setCompany("");
      } else {
        Swal.fire(
          "Error",
          data.message || "No se pudo registrar el usuario",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Error en la solicitud:", error);
      Swal.fire("Error", "Error de conexión con el servidor", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h1>Registrar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <FormSection title="Datos del Usuario">
          <Input
            label="Nombre"
            placeholder="Ingrese su nombre"
            value={firstName}
            inputText={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Apellido"
            placeholder="Ingrese su apellido"
            value={lastName}
            inputText={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Input
            label="Username"
            placeholder="Ingrese su username"
            value={userName}
            inputText={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            label="Email"
            placeholder="Ingrese su email"
            value={email}
            inputText={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <Input
            label="Contraseña"
            placeholder="Ingrese su contraseña"
            value={password}
            inputText={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
          <Select
            label="Empresa"
            placeholder="Seleccione la empresa"
            value={company}
            inputText={company}
            onChange={(e) => setCompany(e.target.value)}
            options={companyOptions}
          />
        </FormSection>
        <div className="button-save">
          <Button
            text={loading ? "Registrando..." : "Registrar Usuario"}
            size="medium"
            color="#57cc99"
            type="submit"
          />
        </div>
      </form>
    </FormContainer>
  );
};

export default CreateUser;
