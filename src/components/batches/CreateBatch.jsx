import "./CreateBatch.css";

import React, { useState } from "react";

import API_BASE_URL from "../../config/config";
import Button from "../button/Button";
import Input from "../inputs/InputComponent";
import Select from "../select/SelectComponent";
import Swal from "sweetalert2";
import { countryOptions } from "../../utilities/options";
import { useNavigate } from "react-router-dom";

const CreateBatch = () => {
  const [batchNumber, setBatchNumber] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("Venezuela");
  const [shipmentType, setShipmentType] = useState("Marítimo");
  const [status, setStatus] = useState("Recibido en Almacen");
  const [shipmentDate, setShipmentDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/batches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          batchNumber,
          destinationCountry,
          shipmentType,
          status,
          shipmentDate,
        }),
      });

      if (!response.ok) throw new Error("Error al crear lote.");

      Swal.fire("Éxito", "Lote creado con éxito", "success").then(() => {
        navigate("/lotes");
      });
    } catch (error) {
      Swal.fire("Error", error.message || "No se pudo crear el lote", "error");
    }
  };

  return (
    <div className="create-batch-container">
      <h1>Crear Lote</h1>
      <form onSubmit={handleSubmit} className="create-batch-form">
        <Input
          label="Número de Lote"
          placeholder="Ingrese el número de lote"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          required
        />

        <Select
          label="Destino"
          value={destinationCountry}
          onChange={(e) => setDestinationCountry(e.target.value)}
          options={countryOptions}
        />

        <Select
          label="Tipo de Envío"
          value={shipmentType}
          onChange={(e) => setShipmentType(e.target.value)}
          options={[
            { label: "Marítimo", value: "Marítimo" },
            { label: "Aéreo", value: "Aéreo" },
            { label: "Terrestre", value: "Terrestre" },
          ]}
        />

        <Input
          label="Fecha de salida"
          inputType="date"
          value={shipmentDate}
          onChange={(e) => setShipmentDate(e.target.value)}
        />

        <Input label="Estatus" value={status} inputText={status} disabled />

        {/* Botón al final ocupa las 2 columnas */}
        <div className="form-actions">
          <Button
            text="Crear Lote"
            size="medium"
            color="#4cc9f0"
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateBatch;
