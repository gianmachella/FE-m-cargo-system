import React, { useEffect, useState } from "react";

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
      const response = await fetch(`${API_BASE_URL}/api/batches`);
      const result = await response.json();
      setBatches(result.data || []);
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
        options={batches.map((batch) => ({
          value: batch.id,
          label: batch.batchNumber,
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
