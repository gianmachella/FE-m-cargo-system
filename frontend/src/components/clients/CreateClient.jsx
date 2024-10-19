import "./CreateClient.css";

import { BsFillPencilFill, BsX } from "react-icons/bs";
import { FormContainer, FormSection } from "../form/Form";
import React, { useState } from "react";

import Button from "../button/Button";
import Input from "../inputs/InputComponent";
import Select from "../select/SelectComponent";
import Swal from "sweetalert2";

const CreateClient = (props) => {
  const { clientData } = props;

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const [receptorNombre, setReceptorNombre] = useState("");
  const [receptorApellido, setReceptorApellido] = useState("");
  const [receptorTelefono, setReceptorTelefono] = useState("");
  const [receptorDireccion, setReceptorDireccion] = useState("");
  const [receptorPais, setReceptorPais] = useState("");

  const [receptores, setReceptores] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [clientErrors, setClientErrors] = useState({});
  const [receptorErrors, setReceptorErrors] = useState({});
  const [loading, setLoading] = useState(false); // Para manejar el estado de carga
  const [successMessage, setSuccessMessage] = useState(""); // Para manejar mensajes de éxito

  console.log("Data", clientData);

  const countryOptions = [
    { label: "Venezuela", value: "ven" },
    { label: "Colombia", value: "col" },
    { label: "Ecuador", value: "ecu" },
  ];

  const validateClient = () => {
    const errors = {};
    if (!nombre) errors.nombre = "Nombre requerido";
    if (!apellido) errors.apellido = "Apellido requerido";
    if (!telefono || !/^\d{10}$/.test(telefono))
      errors.telefono = "Teléfono inválido (10 dígitos)";
    if (!email || !/^\S+@\S+\.\S+$/.test(email))
      errors.email = "Correo electrónico inválido";
    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateReceptor = () => {
    const errors = {};
    if (!receptorNombre) errors.receptorNombre = "Nombre requerido";
    if (!receptorApellido) errors.receptorApellido = "Apellido requerido";
    if (!receptorTelefono || !/^\d{10}$/.test(receptorTelefono))
      errors.receptorTelefono = "Teléfono inválido (10 dígitos)";
    if (!receptorDireccion) errors.receptorDireccion = "Dirección requerida";
    if (!receptorPais || receptorPais === "")
      errors.receptorPais = "País requerido";
    setReceptorErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const addReceptor = () => {
    if (validateReceptor()) {
      if (editingIndex !== null) {
        const updatedReceptores = receptores.map((receptor, index) =>
          index === editingIndex
            ? {
                nombre: receptorNombre,
                apellido: receptorApellido,
                telefono: receptorTelefono,
                direccion: receptorDireccion,
                pais: receptorPais,
              }
            : receptor
        );
        setReceptores(updatedReceptores);
        setEditingIndex(null); // Salir del modo edición
      } else {
        setReceptores([
          ...receptores,
          {
            nombre: receptorNombre,
            apellido: receptorApellido,
            telefono: receptorTelefono,
            direccion: receptorDireccion,
            pais: receptorPais,
          },
        ]);
      }
      resetReceptorForm();
    }
  };

  const editReceptor = (index) => {
    const receptor = receptores[index];
    setReceptorNombre(receptor.nombre);
    setReceptorApellido(receptor.apellido);
    setReceptorTelefono(receptor.telefono);
    setReceptorDireccion(receptor.direccion);
    setReceptorPais(receptor.pais);
    setEditingIndex(index);
  };

  const deleteReceptor = (index) => {
    const updatedReceptores = receptores.filter((_, i) => i !== index);
    setReceptores(updatedReceptores);
    setEditingIndex(null);
  };

  const resetReceptorForm = () => {
    setReceptorNombre("");
    setReceptorApellido("");
    setReceptorTelefono("");
    setReceptorDireccion("");
    setReceptorPais("");
    setReceptorErrors({});
  };

  const resetForm = () => {
    setNombre("");
    setApellido("");
    setTelefono("");
    setEmail("");
    setReceptores([]);
    setClientErrors({});
    resetReceptorForm();
  };

  const handleSubmit = async () => {
    if (!validateClient()) return;

    setLoading(true);
    setSuccessMessage("");

    // Obtener el token del localStorage o sessionStorage
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const clientData = {
      firstName: nombre,
      lastName: apellido,
      phone: telefono,
      email,
      createdBy: 1, // Este valor debería venir del usuario autenticado
      receivers: receptores.map((receptor) => ({
        firstName: receptor.nombre,
        lastName: receptor.apellido,
        phone: receptor.telefono,
        address: receptor.direccion,
        country: receptor.pais,
      })),
    };

    try {
      const response = await fetch("http://localhost:5000/api/clients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        const data = await response.json();
        Swal.fire({
          title: "Guardado",
          text: "Cliente guardado con exito",
          icon: "success",
        });
        resetForm(); // Reinicia el formulario tras el éxito
      } else {
        const errorData = await response.json();
        console.error("Error al guardar cliente", errorData);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <h1>Registrar un Cliente</h1>
      <div className="form-wrapper">
        <div className="client-section">
          <FormSection className="col-md-6" title="Registrar Cliente">
            <Input
              label="Nombre"
              placeholder="Nombre"
              value={nombre}
              inputText={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {clientErrors.nombre && (
              <p className="error">{clientErrors.nombre}</p>
            )}
            <Input
              label="Apellido"
              placeholder="Apellido"
              value={apellido}
              inputText={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
            {clientErrors.apellido && (
              <p className="error">{clientErrors.apellido}</p>
            )}
            <Input
              label="Teléfono"
              placeholder="Teléfono"
              value={telefono}
              inputText={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
            {clientErrors.telefono && (
              <p className="error">{clientErrors.telefono}</p>
            )}
            <Input
              label="Email"
              placeholder="Email"
              value={email}
              inputText={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {clientErrors.email && (
              <p className="error">{clientErrors.email}</p>
            )}
          </FormSection>
        </div>

        <div className="receptor-section">
          <FormSection
            className="col-md-6"
            title={
              editingIndex !== null ? "Editar Receptor" : "Agregar Receptor"
            }
          >
            <Input
              label="Nombre"
              placeholder="Nombre"
              value={receptorNombre}
              inputText={receptorNombre}
              onChange={(e) => setReceptorNombre(e.target.value)}
            />
            {receptorErrors.receptorNombre && (
              <p className="error">{receptorErrors.receptorNombre}</p>
            )}
            <Input
              label="Apellido"
              placeholder="Apellido"
              value={receptorApellido}
              inputText={receptorApellido}
              onChange={(e) => setReceptorApellido(e.target.value)}
            />
            {receptorErrors.receptorApellido && (
              <p className="error">{receptorErrors.receptorApellido}</p>
            )}
            <Input
              label="Teléfono"
              placeholder="Teléfono"
              value={receptorTelefono}
              inputText={receptorTelefono}
              onChange={(e) => setReceptorTelefono(e.target.value)}
            />
            {receptorErrors.receptorTelefono && (
              <p className="error">{receptorErrors.receptorTelefono}</p>
            )}
            <Input
              label="Dirección"
              placeholder="Dirección"
              value={receptorDireccion}
              inputText={receptorDireccion}
              onChange={(e) => setReceptorDireccion(e.target.value)}
            />
            {receptorErrors.receptorDireccion && (
              <p className="error">{receptorErrors.receptorDireccion}</p>
            )}
            <Select
              label="País"
              placeholder="Selecciona un país"
              value={receptorPais}
              onChange={(e) => setReceptorPais(e.target.value)}
              options={countryOptions}
            />
            {receptorErrors.receptorPais && (
              <p className="error">{receptorErrors.receptorPais}</p>
            )}
            <Button
              onClick={addReceptor}
              text={
                editingIndex !== null ? "Guardar Cambios" : "Agregar Receptor"
              }
              size="small"
              color="#1b1b29"
            />
          </FormSection>
          {receptores.length > 0 && <h3>Receptores Agregados</h3>}
          <div>
            {receptores.map((receptor, index) => (
              <ul key={index}>
                <li>
                  <div className="receptor-item">
                    {receptor.nombre} {receptor.apellido} - {receptor.telefono}
                    <div className="buttons-receptorlist-container">
                      <Button
                        icon={<BsFillPencilFill />}
                        onClick={() => editReceptor(index)}
                        shape="circular"
                        size="extrasmall"
                        iconPosition="center"
                        color="#00b4d8"
                      />
                      <Button
                        icon={<BsX />}
                        onClick={() => deleteReceptor(index)}
                        shape="circular"
                        size="extrasmall"
                        iconPosition="center"
                        color="#e63946"
                      />
                    </div>
                  </div>
                </li>
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className="button-save">
        <Button
          text={loading ? "Guardando..." : "Guardar Cliente"}
          onClick={handleSubmit}
          size="medium"
          color="#57cc99"
          disabled={loading}
        />
      </div>
    </FormContainer>
  );
};

export default CreateClient;
