import { FormContainer, FormSection } from "../../form/Form";
import React, { useEffect, useMemo, useState } from "react";

import API_BASE_URL from "../../../config/config";
import Accordion from "../../acordion/Acordion";
import ButtonComponent from "../../button/Button";
import { FaLastfmSquare } from "react-icons/fa";
import Input from "../../inputs/InputComponent";
import Select from "../../select/SelectComponent";
import Swal from "sweetalert2";

export const Steep1 = (props) => {
  const { setDataSteepOne, handleNextStep } = props;
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState([]);
  const [openAccordionClient, setOpenAccordionClient] = useState(false);
  const [openAccordionCustomer, setOpenAccordionCustomer] = useState(false);
  const [openAccordionReceiver, setOpenAccordionReceiver] = useState(false);

  const loadClients = async (searchTerm) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clients?search=${searchTerm || ""}`
      );
      const result = await response.json();
      setClients(result.data || []);
      setOpenAccordionClient(result?.data.length > 0 ? true : false);
    } catch (error) {
      console.error("Error loading clients:", error);
      Swal.fire("Error", "No se pudieron cargar los clientes.", "error");
    }
  };

  const loadReceivers = async (clientId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/clients/${clientId}/receivers`
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
    setSelectedClient([client]);
    loadReceivers(client.id);
  };

  const handleReceiverSelect = (receiverId) => {
    const receiver = receivers.find((r) => r.id === parseInt(receiverId));
    setSelectedReceiver([receiver]);
  };

  useEffect(() => {
    if (search.length > 2) {
      loadClients(search);
    }
  }, [search]);

  useMemo(() => {
    setOpenAccordionCustomer(selectedClient?.length ? true : false);
    setOpenAccordionReceiver(selectedReceiver?.length ? true : false);
  }, [selectedClient, selectedReceiver]);

  return (
    <FormContainer>
      <h2>Seleccionar Cliente</h2>
      <Input
        placeholder="Buscar cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Accordion
        title="Lista de Usuarios encontrados..."
        isOpen={openAccordionClient}
        onToggle={setOpenAccordionClient}
      >
        <div className="clients-list mb-3">
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
      </Accordion>
      <Accordion
        title="Datos del Cliente"
        isOpen={openAccordionCustomer}
        onToggle={setOpenAccordionCustomer}
      >
        {selectedClient.length && (
          <FormSection>
            <div className="form-par">
              <Input
                label="Nombre"
                value={selectedClient[0]?.firstName}
                inputText={selectedClient[0]?.firstName}
                disabled
              />
              <Input
                label="Apellido"
                value={selectedClient[0]?.lastName}
                inputText={selectedClient[0]?.lastName}
                disabled
              />
            </div>
            <div className="form-par">
              <Input
                label="Teléfono"
                value={selectedClient[0]?.phone}
                inputText={selectedClient[0]?.phone}
                disabled
              />
              <Input
                label="Email"
                value={selectedClient[0]?.email}
                inputText={selectedClient[0]?.email}
                disabled
              />
            </div>
            <Select
              label="Seleccionar Receptor"
              value={selectedReceiver[0]?.id}
              width="300px"
              options={(Array.isArray(receivers) ? receivers : []).map(
                (receiver) => ({
                  value: `${receiver.id}`,
                  label: `${receiver.firstName} ${receiver.lastName}`,
                })
              )}
              onChange={(e) => handleReceiverSelect(e.target.value)}
            />
          </FormSection>
        )}
      </Accordion>
      <Accordion
        title="Datos de Receptor"
        isOpen={openAccordionReceiver}
        onToggle={setOpenAccordionReceiver}
      >
        {selectedReceiver && (
          <FormSection>
            <div className="form-par">
              <Input
                label="Nombre"
                value={selectedReceiver[0]?.firstName}
                inputText={selectedReceiver[0]?.firstName}
                disabled
              />
              <Input
                label="Apellido"
                value={selectedReceiver[0]?.lastName}
                inputText={selectedReceiver[0]?.lastName}
                disabled
              />
            </div>
            <div className="form-par">
              <Input
                label="Teléfono"
                value={selectedReceiver[0]?.phone}
                inputText={selectedReceiver[0]?.phone}
                disabled
              />
              <Input
                label="País"
                value={selectedReceiver[0]?.country}
                inputText={selectedReceiver[0]?.country}
                disabled
              />
            </div>
            <Input
              label="Dirección"
              value={selectedReceiver[0]?.address}
              inputText={selectedReceiver[0]?.address}
              disabled
            />
          </FormSection>
        )}
      </Accordion>
      <ButtonComponent
        text="Siguiente"
        color="#57cc99"
        onClick={() => {
          handleNextStep();
          setDataSteepOne({
            clientData: selectedClient[0],
            receiverData: selectedReceiver[0],
          });
        }}
        disabled={!selectedClient || !selectedReceiver}
      />
    </FormContainer>
  );
};
