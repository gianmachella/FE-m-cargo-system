import "./ShippingWizard.css";

import { BsBox2, BsBoxes } from "react-icons/bs";
import { FaPen, FaTrashCan } from "react-icons/fa6";
import { FormContainer, FormSection } from "../form/Form";
import React, { useEffect, useState } from "react";

import Button from "../button/Button";
import { FaUser } from "react-icons/fa";
import Input from "../inputs/InputComponent";
import Modal from "react-modal";
import Select from "../select/SelectComponent";
import Swal from "sweetalert2";

// Opciones de tamaños de caja
const sizeBoxOptions = [
  {
    value: "17X11X11 - Small",
    label: "17X11X11 - Small",
    volume: (17 * 11 * 11) / 1728,
  },
  {
    value: "12X12X16 - Small",
    label: "12X12X16 - Small",
    volume: (12 * 12 * 16) / 1728,
  },
  {
    value: "21X15X15 - Medium",
    label: "21X15X15 - Medium",
    volume: (21 * 15 * 15) / 1728,
  },
  {
    value: "18X18X16 - Medium",
    label: "18X18X16 - Medium",
    volume: (18 * 18 * 16) / 1728,
  },
  {
    value: "27X15X16 - Large",
    label: "27X15X16 - Large",
    volume: (27 * 15 * 16) / 1728,
  },
  {
    value: "18X18X24 - Large",
    label: "18X18X24 - Large",
    volume: (18 * 18 * 24) / 1728,
  },
  {
    value: "24X20X21 - ExtraLarge",
    label: "24X20X21 - ExtraLarge",
    volume: (24 * 20 * 21) / 1728,
  },
  {
    value: "22X22X21 - ExtraLarge",
    label: "22X22X21 - ExtraLarge",
    volume: (22 * 22 * 21) / 1728,
  },
  { value: "personality", label: "Tamaño personalizado", volume: 0 },
];

Modal.setAppElement("#root");

const ShippingWizard = () => {
  const [status, setStatus] = useState("Pending");
  const [shipmentType, setShipmentType] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [receivers, setReceivers] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [newBox, setNewBox] = useState({ weight: "", size: "" });
  const [customSize, setCustomSize] = useState(false);
  const [search, setSearch] = useState("");
  const [shipmentNumber, setShipmentNumber] = useState("");
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Cargar lotes al inicio
  useEffect(() => {
    loadBatches();
  }, []);

  // Cargar clientes
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

  // Cargar lotes
  const loadBatches = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/batches`);
      const result = await response.json();
      setBatches(result.data || []);
    } catch (error) {
      console.error("Error loading batches:", error);
      Swal.fire("Error", "No se pudieron cargar los lotes.", "error");
    }
  };
  // Cargar receptores del cliente seleccionado
  const loadReceivers = async (clientId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/clients/${clientId}/receivers`
      );
      const result = await response.json();
      setReceivers(result || []);
    } catch (error) {
      console.error("Error loading receivers:", error);
      Swal.fire("Error", "No se pudieron cargar los receptores.", "error");
    }
  };

  // Manejar selección de cliente (modificado)
  const handleClientSelect = (client) => {
    setSelectedClient(client);
    loadReceivers(client.id); // Cargar los receptores del cliente seleccionado
  };

  const handleReceiverSelect = (receiverId) => {
    const receiver = receivers.find((r) => r.id === parseInt(receiverId));
    setSelectedReceiver(receiver);
  };

  // Avanzar al siguiente paso
  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  // Volver al paso anterior
  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Manejar adición de caja
  const handleBoxAdd = () => {
    const weight = parseFloat(newBox.weight);
    const selectedSizeOption = sizeBoxOptions.find(
      (option) => option.value === newBox.size
    );

    if (isNaN(weight) || weight <= 0) {
      Swal.fire("Error", "El peso debe ser un número positivo.", "error");
      return;
    }

    if (!selectedSizeOption) {
      Swal.fire("Error", "Seleccione un tamaño de caja válido.", "error");
      return;
    }

    setBoxes([...boxes, { ...newBox, volume: selectedSizeOption.volume }]);
    setNewBox({ weight: "", size: "" });

    // Actualizar peso y número de cajas
    setTotalWeight((prev) => prev + weight);
    setTotalBoxes((prev) => prev + 1);
  };

  // Calcular volumen total en ft³
  const calculateTotalVolume = () => {
    return boxes.reduce((acc, box) => acc + box.volume, 0).toFixed(2);
  };

  // Manejar eliminación de caja
  const handleBoxRemove = (index) => {
    const boxToRemove = boxes[index];

    setBoxes(boxes.filter((_, i) => i !== index));
    setTotalWeight((prev) => prev - parseFloat(boxToRemove.weight));
    setTotalBoxes((prev) => prev - 1);
  };

  const handleFinalize = () => setShowConfirmationModal(true);

  const handleSaveShipment = async () => {
    try {
      const shipmentData = {
        shipmentNumber,
        clientId: selectedClient.id,
        totalWeight,
        totalVolume,
        totalBoxes: boxes.length,
        status: "recibido en almacen",
        receiver: selectedReceiver,
      };

      const response = await fetch("http://localhost:5000/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) throw new Error("Error al guardar el envío.");

      Swal.fire("¡Éxito!", "El envío ha sido registrado.", "success");
      setShowConfirmationModal(false);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  useEffect(() => {
    if (search.length > 2) {
      loadClients(search); // Buscar si hay más de 2 caracteres
    }
  }, [search]);

  return (
    <div className="wizard-container">
      <h1>Registro de Envio</h1>
      <div className="steps-indicator">
        <hr
          className={`linea-personalizada ${currentStep >= 1 ? "active" : ""}`}
        />
        <div
          className={`icon-wrapper ${currentStep >= 1 ? "active" : ""}`}
          title="Paso 1: Seleccionar Cliente"
        >
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <FaUser />
          </div>
        </div>

        <hr
          className={`linea-personalizada ${currentStep >= 2 ? "active" : ""}`}
        />
        <div
          className={`icon-wrapper ${currentStep >= 2 ? "active" : ""}`}
          title="Paso 2: Seleccionar Lote"
        >
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <BsBoxes />
          </div>
        </div>

        <hr
          className={`linea-personalizada ${currentStep === 3 ? "active" : ""}`}
        />
        <div
          className={`icon-wrapper ${currentStep === 3 ? "active" : ""}`}
          title="Paso 3: Datos del Envío"
        >
          <div className={`step ${currentStep === 3 ? "active" : ""}`}>
            <BsBox2 />
          </div>
        </div>

        <hr
          className={`linea-personalizada ${currentStep === 3 ? "active" : ""}`}
        />
      </div>

      {currentStep === 1 && (
        <FormContainer>
          <h2>Seleccionar Cliente</h2>
          <Input
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="clients-list">
            {clients.length > 0 ? (
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
                options={receivers.map((receiver) => ({
                  value: receiver.id,
                  label: `${receiver.firstName} ${receiver.lastName}`,
                }))}
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

          <Button
            text="Siguiente"
            color="#57cc99"
            onClick={handleNextStep}
            disabled={!selectedClient || !selectedReceiver}
          />
        </FormContainer>
      )}
      {currentStep === 2 && (
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
            <Button
              color="#57cc99"
              text="Anterior"
              onClick={handlePreviousStep}
            />
            <Button
              color="#57cc99"
              text="Siguiente"
              onClick={handleNextStep}
              disabled={!selectedBatch}
            />
          </div>
        </FormContainer>
      )}
      {currentStep === 3 && (
        <FormContainer>
          <h2>Datos del Envío</h2>
          <div className="form-par">
            <Input
              label="Número de Envío"
              placeholder="Ingrese el número"
              value={shipmentNumber}
              onChange={(e) => setShipmentNumber(e.target.value)}
            />
            <Select
              label="Tipo de Envío"
              value={shipmentType}
              options={[
                { value: "Marítimo", label: "Marítimo" },
                { value: "Aéreo", label: "Aéreo" },
                { value: "Terrestre", label: "Terrestre" },
              ]}
              onChange={(e) => setShipmentType(e.target.value)}
            />
          </div>
          <h4>Agregar cajas al envío:</h4>
          <div className="form-par">
            <Input
              label="Peso (lbs)"
              value={newBox.weight}
              onChange={(e) => setNewBox({ ...newBox, weight: e.target.value })}
            />
            <Select
              label="Tamaño"
              value={newBox.size}
              options={sizeBoxOptions}
              onChange={(e) => {
                const size = e.target.value;
                setNewBox({ ...newBox, size });
                setCustomSize(size === "personality");
              }}
            />
          </div>

          <Button
            text="Agregar Caja"
            color="#0a91af"
            onClick={handleBoxAdd}
            disabled={newBox?.weight === "" || newBox?.size === ""}
          />
          <ul className="boxes-list">
            {boxes.map((box, index) => (
              <li key={index}>
                <div className="box-item">
                  Peso: {box?.weight} lbs, Tamaño: {box.size}
                  <Button
                    color="#e63946"
                    shape="circular"
                    size="extrasmall"
                    icon={<FaTrashCan />}
                    iconPosition="center"
                    onClick={() => handleBoxRemove(index)}
                  />
                </div>
              </li>
            ))}
          </ul>

          <p>Total Cajas: {totalBoxes}</p>
          <p>Peso Total: {totalWeight.toFixed(2)} lbs</p>
          <p>Volumen Total: {calculateTotalVolume()} ft³</p>

          <div className="buttons-wizard">
            <Button
              text="Anterior"
              color="#57cc99"
              onClick={handlePreviousStep}
            />
            <Button
              text="Finalizar"
              color="#38b000"
              onClick={handleFinalize}
              disabled={boxes.length === 0 || !shipmentNumber}
            />
          </div>
        </FormContainer>
      )}
      <Modal
        isOpen={showConfirmationModal}
        onRequestClose={() => setShowConfirmationModal(false)}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <h2 className="modal-title">Confirmar Envío</h2>
        <div className="modal-content">
          <p>
            <strong>Cliente:</strong> {selectedClient?.firstName}{" "}
            {selectedClient?.lastName}
          </p>
          <p>
            <strong>Receptor:</strong> {selectedReceiver?.firstName}{" "}
            {selectedReceiver?.lastName}
          </p>
          <p>
            <strong>Direccion:</strong> {selectedReceiver?.address}
          </p>
          <p>
            <strong>Lote:</strong> {selectedBatch?.batchNumber}
          </p>
          <p>
            <strong>Número de Envío:</strong> {shipmentNumber}
          </p>
          <p>
            <strong>Total Cajas:</strong> {boxes.length}
          </p>
          <p>
            <strong>Peso Total:</strong> {totalWeight} lbs
          </p>
          <p>
            <strong>Volumen Total:</strong> {calculateTotalVolume()} ft³
          </p>
        </div>

        <div className="modal-actions">
          <Button
            text="Cancelar"
            color="#e63946"
            onClick={() => setShowConfirmationModal(false)}
          />
          <Button text="Guardar" color="#38b000" onClick={handleSaveShipment} />
        </div>
      </Modal>
    </div>
  );
};

export default ShippingWizard;
