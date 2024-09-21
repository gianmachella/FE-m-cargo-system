import React, { useEffect, useState } from "react";

import axios from "axios";

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/clients", {
          headers: { Authorization: token },
        });
        setClients(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchClients();
  }, []);

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/clients/search?term=${searchTerm}`,
        {
          headers: { Authorization: token },
        }
      );
      setClients(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clientes</h2>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar por nombre, apellido o teléfono"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} className="btn btn-primary mt-2">
        Buscar
      </button>
      <ul className="list-group mt-4">
        {clients.map((client) => (
          <li key={client.id} className="list-group-item">
            {client.first_name} {client.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListClients;
