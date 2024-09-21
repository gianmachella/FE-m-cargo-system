import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";

const ListBatches = () => {
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/batches", {
          headers: {
            Authorization: token,
          },
        });
        setBatches(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchBatches();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista de Lotes</h2>
      <ul className="list-group">
        {batches.map((batch) => (
          <li key={batch.id} className="list-group-item">
            Lote: {batch.number} - Destino: {batch.destination} - Tipo:{" "}
            {batch.type}
            <Link to={`/lotes/${batch.id}`} className="btn btn-info ml-2">
              Ver Detalles
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListBatches;
