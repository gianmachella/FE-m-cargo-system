import "./CreateBatch.css";

import React, { useState } from "react";
import { countryOptions, statusOptions } from "../../utilities/options";

import API_BASE_URL from "../../config/config";
import Button from "../button/Button";
import Input from "../inputs/InputComponent";
import Select from "../select/SelectComponent";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CreateBatch = () => {
  const [batchNumber, setBatchNumber] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("Venezuela");
  const [shipmentType, setShipmentType] = useState("Marítimo");
  const [status, setStatus] = useState("Recibido en Almacen");
  const [createdBy, setCreatedBy] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/batches`, {
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
          createdBy,
          updatedBy: createdBy,
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
        <div className="form-group">
          <Input
            label="Número de Lote"
            placeholder="Ingrese el número de lote"
            value={batchNumber}
            inputText={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <Select
            label="Destino"
            value={destinationCountry}
            inputText={destinationCountry}
            onChange={(e) => setDestinationCountry(e.target.value)}
            options={countryOptions}
          />
        </div>

        <div className="form-group">
          <Select
            label="Tipo de Envío"
            value={shipmentType}
            inputText={shipmentType}
            onChange={(e) => setShipmentType(e.target.value)}
            options={[
              { label: "Marítimo", value: "Marítimo" },
              { label: "Aéreo", value: "Aéreo" },
              { label: "Terrestre", value: "Terrestre" },
            ]}
          />
        </div>

        <div className="form-group">
          <Input label="Estatus" value={status} inputText={status} disabled />
        </div>

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
