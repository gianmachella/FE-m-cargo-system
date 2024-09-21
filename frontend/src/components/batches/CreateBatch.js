import React, { useState } from "react";

import Swal from "sweetalert2";
import axios from "axios";

const CreateBatch = () => {
  const [number, setNumber] = useState("");
  const [destination, setDestination] = useState("Venezuela");
  const [type, setType] = useState("Marítimo");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/batches/create",
        { number, destination, type },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      Swal.fire("Lote creado correctamente", "", "success");
    } catch (err) {
      Swal.fire("Error al crear el lote", "", "error");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Lote</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Número de Lote</label>
          <input
            type="text"
            className="form-control"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Destino</label>
          <select
            className="form-control"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          >
            <option value="Venezuela">Venezuela</option>
            <option value="Colombia">Colombia</option>
            <option value="Ecuador">Ecuador</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select
            className="form-control"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="Marítimo">Marítimo</option>
            <option value="Aéreo">Aéreo</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Crear Lote
        </button>
      </form>
    </div>
  );
};

export default CreateBatch;
