import React, { useEffect, useState } from "react";
import { formatSimpleFecha, formatarFecha } from "../../../utilities/utilities";

import API_BASE_URL from "../../../config/config";
import ButtonComponent from "../../button/Button";
import { FormContainer } from "../../form/Form";
import Select from "../../select/SelectComponent";
import Swal from "sweetalert2";

const Steep2 = (props) => {
  const { setDataSteepTwo, handleNextStep, handlePreviousStep } = props;

  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const loadBatches = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      // 🚀 pedimos todos los lotes (limit grande) y ordenados
      const response = await fetch(
        `${API_BASE_URL}/batches?page=1&limit=1000`, // 👈 así nos aseguramos de traer todos
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar los lotes");

      const result = await response.json();

      // 🚀 Ordenamos en FE por createdAt DESC por si acaso
      const sorted = (result.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBatches(sorted);
    } catch (error) {
      console.error("Error loading batches:", error);
      Swal.fire("Error", "No se pudieron cargar los lotes.", "error");
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  return (
    <FormContainer>
      <h2>Seleccionar Lote</h2>
      <Select
        label="Lote"
        width="300px"
        value={selectedBatch?.id || ""}
        options={batches.map((batch) => ({
          value: batch.id,
          label: `${batch.batchNumber} - ${formatSimpleFecha(batch.createdAt)}`, // 👈 simple
        }))}
        onChange={(e) =>
          setSelectedBatch(
            batches.find((batch) => batch.id === parseInt(e.target.value))
          )
        }
      />

      {selectedBatch && (
        <div className="batch-card">
          <p>Número de Lote: {selectedBatch.batchNumber}</p>
          <p>Destino: {selectedBatch.destinationCountry}</p>
          <p>Creado: {formatarFecha(selectedBatch.createdAt)}</p>
          <p>Tipo de Envío: {selectedBatch.shipmentType}</p>
        </div>
      )}
      <div className="buttons-wizard">
        <ButtonComponent
          color="#57cc99"
          text="Anterior"
          onClick={handlePreviousStep}
        />
        <ButtonComponent
          color="#57cc99"
          text="Siguiente"
          onClick={() => {
            handleNextStep();
            setDataSteepTwo(selectedBatch);
          }}
          disabled={!selectedBatch}
        />
      </div>
    </FormContainer>
  );
};

export default Steep2;
