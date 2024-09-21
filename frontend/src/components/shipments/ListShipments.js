import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import axios from "axios";

const ListShipments = () => {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/shipments", {
          headers: { Authorization: token },
        });
        setShipments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchShipments();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista de Envíos</h2>
      <ul className="list-group">
        {shipments.map((shipment) => (
          <li key={shipment.id} className="list-group-item">
            Envío: {shipment.shipment_number} - Cliente: {shipment.client_id} -
            Estado: {shipment.status}
            <Link to={`/envios/${shipment.id}`} className="btn btn-info ml-2">
              Ver Detalles
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListShipments;
