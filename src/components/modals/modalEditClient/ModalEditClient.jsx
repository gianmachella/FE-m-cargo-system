import React, { useEffect, useState } from "react";
import {
  fetchCities,
  fetchCountries,
  fetchStates,
} from "../../../services/cscApi";

import ButtonComponent from "../../button/Button";
import ClientForm from "./ClientForm";
import { FormContainer } from "../../form/Form";
import Modal from "react-modal";
import ReceiverForm from "./ReceiverForm";
import ReceiversList from "./ReceiversList";
import Swal from "sweetalert2";

const ModalEditClient = ({
  isEditModalOpen,
  closeModal,
  selectedClient,
  updateClient,
  updateReceiver,
  createReceiver,
}) => {
  // ✅ inicializar con strings vacíos
  const [clientData, setClientData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [receptors, setReceptors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [isEditingReceiver, setIsEditingReceiver] = useState(false);
  const [isNewReceiver, setIsNewReceiver] = useState(false);
  const [receiverIndexToEdit, setReceiverIndexToEdit] = useState(null);

  const [newReceiver, setNewReceiver] = useState({});
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [editStateList, setEditStateList] = useState([]);
  const [editCityList, setEditCityList] = useState([]);

  // Load client info
  useEffect(() => {
    if (selectedClient) {
      setClientData({
        id: selectedClient.id || "",
        firstName: selectedClient.firstName || "",
        lastName: selectedClient.lastName || "",
        phone: selectedClient.phone || "",
        email: selectedClient.email || "",
      });
      setReceptors(selectedClient.receivers || []);
    }
  }, [selectedClient]);

  // Countries
  useEffect(() => {
    fetchCountries().then(setCountryList).catch(console.error);
  }, []);

  // States & Cities for new receiver
  useEffect(() => {
    if (newReceiver.country) {
      fetchStates(newReceiver.country).then(setStateList).catch(console.error);
    }
  }, [newReceiver.country]);

  useEffect(() => {
    if (newReceiver.country && newReceiver.state) {
      fetchCities(newReceiver.country, newReceiver.state)
        .then(setCityList)
        .catch(console.error);
    }
  }, [newReceiver.country, newReceiver.state]);

  // States & Cities for edit receiver
  const receptorToEdit = receptors[receiverIndexToEdit] || {};

  useEffect(() => {
    if (isEditingReceiver && receptorToEdit?.country) {
      fetchStates(receptorToEdit.country)
        .then(setEditStateList)
        .catch(console.error);
    }
  }, [isEditingReceiver, receiverIndexToEdit]);

  useEffect(() => {
    if (isEditingReceiver && receptorToEdit?.country && receptorToEdit?.state) {
      fetchCities(receptorToEdit.country, receptorToEdit.state)
        .then(setEditCityList)
        .catch(console.error);
    }
  }, [isEditingReceiver, receiverIndexToEdit]);

  const handleClientChange = (field, value) => {
    setClientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReceiverChange = (index, field, value) => {
    const updated = [...receptors];
    updated[index] = { ...updated[index], [field]: value };
    setReceptors(updated);
  };

  const handleSaveChanges = async () => {
    const updatedClient = { ...clientData, receptors };
    try {
      await updateClient(updatedClient);
      for (const r of receptors) {
        if (r.id) await updateReceiver(r, clientData.id);
        else await createReceiver({ ...r, clientId: clientData.id });
      }
      Swal.fire(
        "Éxito",
        "Cliente y receptores actualizados con éxito",
        "success"
      );
      closeModal();
    } catch {
      Swal.fire("Error", "No se pudo actualizar el cliente", "error");
    }
  };

  return (
    <Modal
      isOpen={isEditModalOpen}
      onRequestClose={closeModal}
      className={`modal ${isEditModalOpen ? "modal--open" : ""}`}
      overlayClassName={`modal-overlay ${
        isEditModalOpen ? "modal-overlay--open" : ""
      }`}
    >
      {clientData.id ? (
        <FormContainer>
          <h1>{isEditing ? "Editar Cliente" : "Ver Cliente"}</h1>

          <div
            style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
          >
            {/* Cliente a la izquierda */}
            <div style={{ flex: 1 }}>
              <ClientForm
                clientData={clientData}
                isEditing={isEditing}
                onChange={handleClientChange}
              />
            </div>

            {/* Receptores a la derecha */}
            <div style={{ flex: 1 }}>
              <ReceiversList
                receptors={receptors}
                isEditing={isEditing}
                onEdit={(i) => {
                  setReceiverIndexToEdit(i);
                  setIsEditingReceiver(true);
                  setIsNewReceiver(false);
                }}
                onAdd={() => setIsNewReceiver(true)}
              />

              {isEditingReceiver && (
                <ReceiverForm
                  receiver={receptorToEdit}
                  onChange={(f, v) =>
                    handleReceiverChange(receiverIndexToEdit, f, v)
                  }
                  onSave={() => setIsEditingReceiver(false)}
                  onCancel={() => setIsEditingReceiver(false)}
                  countryList={countryList}
                  stateList={editStateList}
                  cityList={editCityList}
                />
              )}

              {isNewReceiver && (
                <ReceiverForm
                  receiver={newReceiver}
                  onChange={(f, v) => setNewReceiver((p) => ({ ...p, [f]: v }))}
                  onSave={() => {
                    setReceptors((prev) => [
                      ...prev,
                      { ...newReceiver, id: null },
                    ]);
                    setNewReceiver({});
                    setIsNewReceiver(false);
                  }}
                  onCancel={() => setIsNewReceiver(false)}
                  countryList={countryList}
                  stateList={stateList}
                  cityList={cityList}
                  isNew
                />
              )}
            </div>
          </div>

          {/* Botones finales */}
          <div className="button-save" style={{ marginTop: "20px" }}>
            <ButtonComponent
              text={isEditing ? "Guardar Cambios" : "Editar"}
              onClick={() =>
                isEditing ? handleSaveChanges() : setIsEditing(true)
              }
              size="medium"
              color="#57cc99"
            />
            <ButtonComponent
              text={isEditing ? "Cancelar" : "Cerrar"}
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setIsNewReceiver(false);
                } else closeModal();
              }}
              size="medium"
              color={isEditing ? "#fbfbfb" : "#e63946"}
              textColor={isEditing ? "black" : "white"}
            />
          </div>
        </FormContainer>
      ) : (
        <p>Cargando datos del cliente...</p>
      )}
    </Modal>
  );
};

export default ModalEditClient;
