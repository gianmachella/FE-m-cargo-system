import { FormContainer, FormSection } from "../../form/Form";
import React, { useEffect, useState } from "react";

import ButtonComponent from "../../button/Button";
import { FaPen } from "react-icons/fa6";
import Input from "../../inputs/InputComponent";
import Modal from "react-modal";
import Select from "../../select/SelectComponent";
import Swal from "sweetalert2";
import { countryOptions } from "../../../utilities/options";

const ModalEditClient = (props) => {
  const {
    isEditModalOpen,
    closeModal,
    selectedClient,
    updateClient,
    updateReceiver,
    createReceiver,
  } = props;

  const [clientData, setClientData] = useState({});
  const [receptors, setReceptors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingReceiver, setIsEditingReceiver] = useState(false);
  const [isNewReceiver, setIsNewReceiver] = useState(false);
  const [receiverIndexToEdit, setReceiverIndexToEdit] = useState(null);
  const [newReceiver, setNewReceiver] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    if (selectedClient) {
      setClientData({ ...selectedClient });
      setReceptors(
        selectedClient.receivers ? [...selectedClient.receivers] : []
      );
    }
  }, [selectedClient]);

  const handleClientChange = (field, value) => {
    setClientData((prev) => ({ ...prev, [field]: value }));
  };

  const handleReceiverChange = (index, field, value) => {
    const updatedReceivers = [...receptors];
    updatedReceivers[index] = { ...updatedReceivers[index], [field]: value };
    setReceptors(updatedReceivers);
  };

  const handleEditReceiver = (index) => {
    setReceiverIndexToEdit(index);
    setIsEditingReceiver(true);
    setIsNewReceiver(false);
  };

  const handleNewReceiverChange = (field, value) => {
    setNewReceiver((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    const updatedClient = { ...clientData, receivers: receptors };

    try {
      // 1️⃣ Actualizar el cliente
      await updateClient(updatedClient);

      // 2️⃣ Actualizar receptores existentes
      for (const receiver of receptors) {
        if (receiver.id) {
          await updateReceiver(receiver);
        } else {
          // 3️⃣ Crear receptores nuevos con el clientId correcto
          console.log("Creando receptor:", receiver);
          await createReceiver({ ...receiver, clientId: clientData.id });
        }
      }

      Swal.fire(
        "Éxito",
        "Cliente y receptores actualizados con éxito",
        "success"
      );
      closeModal();
    } catch (error) {
      Swal.fire(
        "Error",
        "No se pudo actualizar el cliente y sus receptores",
        "error"
      );
    }
  };

  const handleSaveEditedReceiver = () => {
    if (receiverIndexToEdit !== null) {
      const updatedReceivers = [...receptors];
      updatedReceivers[receiverIndexToEdit] = {
        ...updatedReceivers[receiverIndexToEdit],
      };

      setReceptors(updatedReceivers);
      setIsEditingReceiver(false);
      setReceiverIndexToEdit(null);
    }
  };

  const addReceptor = () => {
    if (
      !newReceiver.firstName ||
      !newReceiver.lastName ||
      !newReceiver.phone ||
      !newReceiver.address ||
      !newReceiver.city ||
      !newReceiver.state ||
      !newReceiver.country
    ) {
      alert("Todos los campos son obligatorios para agregar un receptor.");
      return;
    }

    const updatedReceptors = [...receptors, { ...newReceiver, id: null }];

    setReceptors(updatedReceptors);

    setNewReceiver({
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });

    setIsNewReceiver(false);
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
          <div className="form-wrapper-horizontal">
            <div className="client-section">
              <FormSection title={isEditing ? "Editar Cliente" : "Cliente"}>
                <Input
                  disabled={!isEditing}
                  label="Nombre"
                  value={clientData.firstName || ""}
                  inputText={clientData.firstName}
                  onChange={(e) =>
                    handleClientChange("firstName", e.target.value)
                  }
                />
                <Input
                  disabled={!isEditing}
                  label="Apellido"
                  value={clientData.lastName || ""}
                  inputText={clientData.lastName}
                  onChange={(e) =>
                    handleClientChange("lastName", e.target.value)
                  }
                />
                <Input
                  disabled={!isEditing}
                  label="Teléfono"
                  value={clientData.phone || ""}
                  inputText={clientData.phone}
                  onChange={(e) => handleClientChange("phone", e.target.value)}
                />
                <Input
                  disabled={!isEditing}
                  label="Email"
                  value={clientData.email || ""}
                  inputText={clientData.email}
                  onChange={(e) => handleClientChange("email", e.target.value)}
                />
              </FormSection>
            </div>

            <div className="receptor-section">
              <h3>Receptores</h3>
              {receptors.length > 0 ? (
                receptors.map((receptor, index) => (
                  <div key={index} className="receptor-item">
                    <p>
                      {receptor.firstName} {receptor.lastName} -{" "}
                      {receptor.phone}
                    </p>
                    {isEditing && (
                      <ButtonComponent
                        onClick={() => handleEditReceiver(index)}
                        size="extrasmall"
                        color="#00b4d8"
                        shape="circular"
                        icon={<FaPen />}
                      />
                    )}
                  </div>
                ))
              ) : (
                <p>No hay receptores registrados.</p>
              )}
              {isEditing && !isNewReceiver && !isEditingReceiver && (
                <ButtonComponent
                  onClick={() => setIsNewReceiver(true)}
                  size="small"
                  color="#00b4d8"
                  text="Agregar"
                />
              )}

              {isEditingReceiver && (
                <FormSection title="Editar Receptor">
                  <Input
                    label="Nombre"
                    value={receptors[receiverIndexToEdit]?.firstName || ""}
                    inputText={receptors[receiverIndexToEdit]?.firstName || ""}
                    onChange={(e) =>
                      handleReceiverChange(
                        receiverIndexToEdit,
                        "firstName",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="Apellido"
                    value={receptors[receiverIndexToEdit]?.lastName || ""}
                    inputText={receptors[receiverIndexToEdit]?.lastName || ""}
                    onChange={(e) =>
                      handleReceiverChange(
                        receiverIndexToEdit,
                        "lastName",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="Teléfono"
                    value={receptors[receiverIndexToEdit]?.phone || ""}
                    inputText={receptors[receiverIndexToEdit]?.phone || ""}
                    onChange={(e) =>
                      handleReceiverChange(
                        receiverIndexToEdit,
                        "phone",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="Dirreccion"
                    value={receptors[receiverIndexToEdit]?.address || ""}
                    inputText={receptors[receiverIndexToEdit]?.address || ""}
                    onChange={(e) =>
                      handleReceiverChange(
                        receiverIndexToEdit,
                        "address",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="Ciudad"
                    value={receptors[receiverIndexToEdit]?.city || ""}
                    inputText={receptors[receiverIndexToEdit]?.city || ""}
                    onChange={(e) =>
                      handleReceiverChange(
                        receiverIndexToEdit,
                        "city",
                        e.target.value
                      )
                    }
                  />
                  <Input
                    label="Estado/Provincia"
                    value={receptors[receiverIndexToEdit]?.state || ""}
                    inputText={receptors[receiverIndexToEdit]?.state || ""}
                    onChange={(e) =>
                      handleReceiverChange(
                        receiverIndexToEdit,
                        "state",
                        e.target.value
                      )
                    }
                  />
                  <Select
                    label="País"
                    placeholder="Selecciona un país"
                    value={receptors[receiverIndexToEdit]?.country || ""}
                    inputText={receptors[receiverIndexToEdit]?.country || ""}
                    onChange={(e) =>
                      handleReceiverChange(
                        receiverIndexToEdit,
                        "country",
                        e.target.value
                      )
                    }
                    options={countryOptions}
                  />

                  <div className="button-save">
                    <ButtonComponent
                      text="Guardar Cambios"
                      onClick={() => {
                        setIsEditingReceiver(false);
                        handleSaveEditedReceiver();
                      }}
                      size="small"
                      color={"#57cc99"}
                    />
                    <ButtonComponent
                      text="Cancelar"
                      onClick={() => setIsEditingReceiver(false)}
                      size="small"
                      color={"#e63946"}
                    />
                  </div>
                </FormSection>
              )}

              {isNewReceiver && (
                <FormSection title="Nuevo Receptor">
                  <Input
                    label="Nombre"
                    value={newReceiver.firstName}
                    inputText={newReceiver.firstName}
                    onChange={(e) =>
                      handleNewReceiverChange("firstName", e.target.value)
                    }
                  />
                  <Input
                    label="Apellido"
                    value={newReceiver.lastName}
                    inputText={newReceiver.lastName}
                    onChange={(e) =>
                      handleNewReceiverChange("lastName", e.target.value)
                    }
                  />
                  <Input
                    label="Teléfono"
                    value={newReceiver.phone}
                    inputText={newReceiver.phone}
                    onChange={(e) =>
                      handleNewReceiverChange("phone", e.target.value)
                    }
                  />
                  <Input
                    label="Dirreccion"
                    value={newReceiver.address || ""}
                    inputText={newReceiver.address || ""}
                    onChange={(e) =>
                      handleNewReceiverChange("address", e.target.value)
                    }
                  />
                  <Input
                    label="Ciudad"
                    value={newReceiver.city || ""}
                    inputText={newReceiver.city || ""}
                    onChange={(e) =>
                      handleNewReceiverChange("city", e.target.value)
                    }
                  />
                  <Input
                    label="Estado/Provincia"
                    value={newReceiver.state || ""}
                    inputText={newReceiver.state || ""}
                    onChange={(e) =>
                      handleNewReceiverChange("state", e.target.value)
                    }
                  />
                  <Select
                    label="País"
                    placeholder="Selecciona un país"
                    value={newReceiver.country || ""}
                    inputText={newReceiver.country || ""}
                    onChange={(e) =>
                      handleNewReceiverChange("country", e.target.value)
                    }
                    options={countryOptions}
                  />
                  <div className="button-save">
                    <ButtonComponent
                      text="Agregar"
                      onClick={addReceptor}
                      size="small"
                      color="#4cc9f0"
                    />
                    <ButtonComponent
                      text="Cancelar"
                      onClick={() => setIsNewReceiver(false)}
                      size="small"
                      color={"#e63946"}
                    />
                  </div>
                </FormSection>
              )}
            </div>
          </div>
          <div className="button-save">
            <ButtonComponent
              text={isEditing ? "Guardar Cambios" : "Editar"}
              onClick={() => {
                if (isEditing) {
                  updateClient();
                  updateReceiver(receptors[receiverIndexToEdit]);
                  handleSaveChanges();
                } else {
                  setIsEditing(true);
                }
              }}
              size="medium"
              color="#57cc99"
            />
            <ButtonComponent
              text={isEditing ? "Cancelar" : "Cerrar"}
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false);
                  setIsNewReceiver(false);
                } else {
                  closeModal();
                }
              }}
              size="medium"
              color={isEditing ? "#fbfbfb" : "#e63946"}
              textColor={isEditing ? "black" : "white"}
            />
          </div>
          ;
        </FormContainer>
      ) : (
        <p>Cargando datos del cliente...</p>
      )}
    </Modal>
  );
};

export default ModalEditClient;
