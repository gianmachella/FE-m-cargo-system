import { FormContainer, FormSection } from "../../form/Form";
import React, { useEffect, useState } from "react";

import ButtonComponent from "../../button/Button";
import Input from "../../inputs/InputComponent";
import Select from "../../select/SelectComponent";
import Swal from "sweetalert2";

export const Steep1 = (props) => {
  const { setDataSteepOne, handleNextStep } = props;
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);

  const loadClients = async (searchTerm) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients?search=${searchTerm || ""}`
      );
      const result = await response.json();
      setClients(result.data || []);
    } catch (error) {
      console.error("Error loading clients:", error);
      Swal.fire("Error", "No se pudieron cargar los clientes.", "error");
    }
  };

  const loadReceivers = async (clientId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${clientId}/receivers`
      );
      const result = await response.json();

      setReceivers(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Error loading receivers:", error);
      Swal.fire("Error", "No se pudieron cargar los receptores.", "error");
      setReceivers([]);
    }
  };

  const handleClientSelect = (client) => {
    setSelectedClient(client);
    loadReceivers(client.id); // Cargar los receptores del cliente seleccionado
  };

  const handleReceiverSelect = (receiverId) => {
    const receiver = receivers.find((r) => r.id === parseInt(receiverId));
    setSelectedReceiver(receiver);
  };

  useEffect(() => {
    if (search.length > 2) {
      loadClients(search); // Buscar si hay más de 2 caracteres
    }
  }, [search]);

  return (
    <FormContainer>
      <h2>Seleccionar Cliente</h2>
      <Input
        placeholder="Buscar cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="clients-list">
        {clients && clients.length > 0 ? (
          clients.map((client) => (
            <div
              key={client.id}
              className="client-card"
              onClick={() => handleClientSelect(client)}
            >
              <p>
                {client.firstName} {client.lastName}
              </p>
              <p>{client.email}</p>
            </div>
          ))
        ) : (
          <p>No se encontraron clientes.</p>
        )}
      </div>

      {selectedClient && (
        <FormSection title="Datos del Cliente">
          <div className="form-par">
            <Input
              label="Nombre"
              value={selectedClient.firstName}
              inputText={selectedClient.firstName}
              disabled
            />
            <Input
              label="Apellido"
              value={selectedClient.lastName}
              inputText={selectedClient.lastName}
              disabled
            />
          </div>
          <div className="form-par">
            <Input
              label="Teléfono"
              value={selectedClient.phone}
              inputText={selectedClient.phone}
              disabled
            />
            <Input
              label="Email"
              value={selectedClient.email}
              inputText={selectedClient.email}
              disabled
            />
          </div>
          <Select
            label="Seleccionar Receptor"
            value={selectedReceiver?.id}
            width="300px"
            options={(Array.isArray(receivers) ? receivers : []).map(
              (receiver) => ({
                value: receiver.id,
                label: `${receiver.firstName} ${receiver.lastName}`,
              })
            )}
            onChange={(e) => handleReceiverSelect(e.target.value)}
          />
        </FormSection>
      )}

      {selectedReceiver && (
        <FormSection title="Datos del Receptor">
          <div className="form-par">
            <Input
              label="Nombre"
              value={selectedReceiver.firstName}
              inputText={selectedReceiver.firstName}
              disabled
            />
            <Input
              label="Apellido"
              value={selectedReceiver.lastName}
              inputText={selectedReceiver.lastName}
              disabled
            />
          </div>
          <div className="form-par">
            <Input
              label="Teléfono"
              value={selectedReceiver.phone}
              inputText={selectedReceiver.phone}
              disabled
            />
            <Input
              label="País"
              value={selectedReceiver.country}
              inputText={selectedReceiver.country}
              disabled
            />
          </div>
          <Input
            label="Dirección"
            value={selectedReceiver.address}
            inputText={selectedReceiver.address}
            disabled
          />
        </FormSection>
      )}

      <ButtonComponent
        text="Siguiente"
        color="#57cc99"
        onClick={() => {
          handleNextStep();
          setDataSteepOne({
            clientData: selectedClient,
            receiverData: selectedReceiver,
          });
        }}
        disabled={!selectedClient || !selectedReceiver}
      />
    </FormContainer>
  );
};
