// ListClients.js
import "./ListClients.css";

import { FaPen, FaTrashCan } from "react-icons/fa6";
import { FormContainer, FormSection } from "../form/Form";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, usePagination, useTable } from "react-table";

import Button from "../button/Button";
import Input from "../inputs/InputComponent";
import Modal from "react-modal"; // Modal para editar/ver clientes
import ReactPaginate from "react-paginate";
import Select from "../select/SelectComponent";
import Swal from "sweetalert2"; // SweetAlert para mensajes
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const fetchClients = async (page, search) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/clients?page=${page}&search=${search || ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch clients.");

  return await response.json();
};

const ListClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [receptors, setReceptors] = useState([]);

  const [isEditingReceiver, setIsEditingReceiver] = useState(false);
  const [isNewReceiver, setIsNewReceiver] = useState(false);
  const [receiverIndexToEdit, setReceiverIndexToEdit] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");

  const [receptorErrors, setReceptorErrors] = useState({});

  const handleEditReceiver = (index) => {
    if (receptors[index]) {
      setReceiverIndexToEdit(index); // Guardamos el índice del receptor
      setIsEditingReceiver(true); // Mostramos el formulario de edición
    } else {
      console.error("El receptor seleccionado no existe.");
      Swal.fire("Error", "El receptor seleccionado no existe", "error");
    }
  };

  const fetchReceiversByClientId = async (clientId) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/clients/${clientId}/receivers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los receptores.");
      }

      const data = await response.json();
      console.log("Receptores del cliente:", data);
      return data;
    } catch (error) {
      console.error("Error al cargar los receptores:", error);
      Swal.fire("Error", "No se pudieron cargar los receptores", "error");
      return [];
    }
  };

  const handleEdit = async (client) => {
    setSelectedClient({ ...client, receivers: client.receivers || [] }); // Asegurar que receivers sea un array
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
  };

  const handleDelete = async (clientId) => {
    const confirmDelete = await Swal.fire({
      icon: "warning",
      title: "Are you sure?",
      text: "This action cannot be undone!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/clients/${clientId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          await loadClients();
          Swal.fire("Deleted!", "Client has been deleted.", "success");
        } else {
          throw new Error("Failed to delete client.");
        }
      } catch (error) {
        Swal.fire("Error", "Error deleting client. Please try again.", "error");
      }
    }
  };

  const updateClient = async () => {
    if (!selectedClient.firstName || !selectedClient.email) {
      Swal.fire("Error", "Nombre y Email son obligatorios", "error");
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const clientResponse = await fetch(
        `http://localhost:5000/api/clients/${selectedClient.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: selectedClient.firstName,
            lastName: selectedClient.lastName,
            phone: selectedClient.phone,
            email: selectedClient.email,
          }),
        }
      );

      if (!clientResponse.ok) throw new Error("Error al actualizar cliente.");

      // Procesar receptores
      const receivers = selectedClient.receivers || [];

      for (const receiver of receivers) {
        if (receiver.id) {
          await updateReceiver(receiver); // Actualizar receptor existente
        } else {
          await createReceiver({ ...receiver, clientId: selectedClient.id }); // Crear receptor nuevo
        }
      }

      Swal.fire(
        "Éxito",
        "Cliente y receptores actualizados con éxito",
        "success"
      );
      setIsEditModalOpen(false);
      loadClients();
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "No se pudo actualizar el cliente",
        "error"
      );
    }
  };

  const createReceiver = async (receiver) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/receivers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(receiver), // Asegúrate de que tiene clientId
      });

      if (!response.ok) throw new Error("Error al crear receptor.");

      Swal.fire("Éxito", "Receptor creado con éxito", "success");
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "No se pudo crear el receptor",
        "error"
      );
    }
  };

  const updateReceiver = async (receiver) => {
    if (!receiver || !receiver.firstName || !receiver.phone) {
      Swal.fire("Error", "Nombre y Teléfono son obligatorios", "error");
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      console.log(receiver);

      const response = await fetch(
        `http://localhost:5000/api/receivers/${receiver.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(receiver),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar receptor.");

      Swal.fire("Éxito", "Receptor actualizado con éxito", "success");
      setIsEditingReceiver(false);
      loadClients(); // Recargar lista de clientes
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "No se pudo actualizar el receptor",
        "error"
      );
    }
  };

  const loadClients = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchClients(page + 1, search);
      setClients(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Failed to load clients. Please try again.");
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiverChange = (index, field, value) => {
    const updatedReceivers = [...receptors];
    updatedReceivers[index] = {
      ...updatedReceivers[index],
      [field]: value, // Actualiza solo el campo modificado
    };
    setReceptors(updatedReceivers); // Guarda el estado actualizado
  };

  useEffect(() => {
    if (selectedClient) {
      fetchReceiversByClientId(selectedClient.id).then(setReceptors);
    }
  }, [selectedClient]);

  useEffect(() => {
    loadClients();
  }, [page, search]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "firstName" },
      { Header: "Last Name", accessor: "lastName" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Email", accessor: "email" },
      {
        Header: "Actions",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              shape="circular"
              size="extrasmall"
              icon={<FaPen />}
              iconPosition="center"
              color="#4cc9f0"
              onClick={() => handleEdit(row.original)}
            />
            <Button
              shape="circular"
              size="extrasmall"
              icon={<FaTrashCan />}
              iconPosition="center"
              color="#ef233c"
              onClick={() => handleDelete(row.original.id)}
            />
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: clients },
    useGlobalFilter,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handlePageChange = (selectedPage) => setPage(selectedPage.selected);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };
  const addReceptor = () => {
    const newReceiver = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      address: address,
      country: country,
    };

    setSelectedClient((prevClient) => ({
      ...prevClient,
      receivers: [...(prevClient.receivers || []), newReceiver],
    }));

    resetReceptorForm();
    setIsNewReceiver(false);
  };

  const resetReceptorForm = () => {
    setFirstName("");
    setLastName("");
    setPhone("");
    setAddress("");
    setCountry("");
    setReceptorErrors({});
  };

  return (
    <div className="list-clients-container">
      <h1>Clientes Registrados</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Busca por nombre, telefono o email..."
          value={search}
          onChange={handleSearch}
          style={{ width: "300px" }} // Ajuste del ancho del input
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading clients...</p>
      ) : clients.length > 0 ? (
        <table {...getTableProps()} className="clients-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td key={cell.column.id} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No clients found.</p>
      )}

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeModal}
        className={`modal ${isEditModalOpen ? "modal--open" : ""}`}
        overlayClassName={`modal-overlay ${
          isEditModalOpen ? "modal-overlay--open" : ""
        }`}
      >
        {selectedClient ? (
          <FormContainer>
            <h1>{isEditing ? "Editar Cliente" : "Ver Cliente"}</h1>
            <div className="form-wrapper-horizontal">
              <div className="client-section">
                <FormSection title={isEditing ? "Editar Cliente" : "Cliente"}>
                  <Input
                    disabled={!isEditing}
                    label="Nombre"
                    placeholder="Nombre"
                    value={selectedClient.firstName || ""}
                    inputText={selectedClient.firstName}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <Input
                    disabled={!isEditing}
                    label="Apellido"
                    placeholder="Apellido"
                    value={selectedClient.lastName || ""}
                    inputText={selectedClient.lastName}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        lastName: e.target.value,
                      })
                    }
                  />
                  <Input
                    disabled={!isEditing}
                    label="Teléfono"
                    placeholder="Teléfono"
                    value={selectedClient.phone || ""}
                    inputText={selectedClient.phone}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        phone: e.target.value,
                      })
                    }
                  />
                  <Input
                    disabled={!isEditing}
                    label="Email"
                    placeholder="Email"
                    value={selectedClient.email || ""}
                    inputText={selectedClient.email}
                    onChange={(e) =>
                      setSelectedClient({
                        ...selectedClient,
                        email: e.target.value,
                      })
                    }
                  />
                </FormSection>
              </div>

              <div className="receptor-section">
                <div className="receptor-list">
                  <h3>Receptores</h3>
                  {receptors.length > 0 ? (
                    receptors.map((receptor, index) => (
                      <div key={index} className="receptor-item">
                        <p>
                          {receptor.firstName} {receptor.lastName} -{" "}
                          {receptor.phone}
                        </p>
                        {isEditing && (
                          <div className="receptor-edit">
                            <Button
                              onClick={() => handleEditReceiver(index)}
                              size="extrasmall"
                              color="#00b4d8"
                              shape="circular"
                              iconPosition="center"
                              icon={<FaPen />}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No hay receptores registrados.</p>
                  )}
                  {isEditing && !isNewReceiver && (
                    <Button
                      onClick={() => setIsNewReceiver(true)}
                      size="small"
                      color="#00b4d8"
                      text="Nuevo"
                    />
                  )}
                </div>
                {isEditingReceiver && (
                  <FormSection
                    title={isNewReceiver ? "Nuevo Receptor" : "Editar Receptor"}
                  >
                    <Input
                      label="Nombre"
                      placeholder="Nombre"
                      value={
                        receptors[receiverIndexToEdit]?.firstName || firstName
                      }
                      inputText={
                        receptors[receiverIndexToEdit]?.firstName || firstName
                      }
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
                      placeholder="Apellido"
                      value={
                        receptors[receiverIndexToEdit]?.lastName || lastName
                      }
                      inputText={
                        receptors[receiverIndexToEdit]?.lastName || lastName
                      }
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
                      placeholder="Teléfono"
                      value={receptors[receiverIndexToEdit]?.phone || phone}
                      inputText={receptors[receiverIndexToEdit]?.phone || phone}
                      onChange={(e) =>
                        handleReceiverChange(
                          receiverIndexToEdit,
                          "phone",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      label="Dirección"
                      placeholder="Dirección"
                      value={receptors[receiverIndexToEdit]?.address || address}
                      inputText={
                        receptors[receiverIndexToEdit]?.address || address
                      }
                      onChange={(e) =>
                        handleReceiverChange(
                          receiverIndexToEdit,
                          "address",
                          e.target.value
                        )
                      }
                    />
                    <Select
                      label="País"
                      value={receptors[receiverIndexToEdit]?.country || country}
                      inputText={
                        receptors[receiverIndexToEdit]?.country || country
                      }
                      onChange={(e) =>
                        handleReceiverChange(
                          receiverIndexToEdit,
                          "country",
                          e.target.value
                        )
                      }
                      options={[
                        { label: "Venezuela", value: "ven" },
                        { label: "Colombia", value: "col" },
                        { label: "Ecuador", value: "ecu" },
                      ]}
                    />

                    <div className="button-receptor-edit">
                      <Button
                        text="Guardar Cambios"
                        onClick={() =>
                          updateReceiver(receptors[receiverIndexToEdit])
                        }
                        size="small"
                        color={"#57cc99"}
                      />
                      <Button
                        text="Cancelar"
                        onClick={() => {
                          setIsEditingReceiver(false);
                          setIsNewReceiver(false);
                        }}
                        size="small"
                        color="#e63946"
                        textColor="white"
                      />
                    </div>
                  </FormSection>
                )}
                {isNewReceiver && (
                  <FormSection
                    title={isNewReceiver ? "Nuevo Receptor" : "Editar Receptor"}
                  >
                    <Input
                      label="Nombre"
                      placeholder="Nombre"
                      value={firstName}
                      inputText={firstName}
                      onChange={(e) => setFirstName(e.target.value)} // Cambiar a e.target.value
                    />
                    <Input
                      label="Apellido"
                      placeholder="Apellido"
                      value={lastName}
                      inputText={lastName}
                      onChange={(e) => setLastName(e.target.value)} // Cambiar a e.target.value
                    />
                    <Input
                      label="Teléfono"
                      placeholder="Teléfono"
                      value={phone}
                      inputText={phone}
                      onChange={(e) => setPhone(e.target.value)} // Cambiar a e.target.value
                    />
                    <Input
                      label="Dirección"
                      placeholder="Dirección"
                      value={address}
                      inputText={address}
                      onChange={(e) => setAddress(e.target.value)} // Cambiar a e.target.value
                    />
                    <Select
                      label="País"
                      value={country}
                      inputText={country}
                      onChange={(e) => setCountry(e.target.value)} // Cambiar a e.target.value
                      options={[
                        { label: "Venezuela", value: "ven" },
                        { label: "Colombia", value: "col" },
                        { label: "Ecuador", value: "ecu" },
                      ]}
                    />

                    <div className="button-receptor-edit">
                      <Button
                        text="Agregar"
                        onClick={() => addReceptor()}
                        size="small"
                        color={isNewReceiver ? "#4cc9f0" : "#57cc99"}
                      />
                      <Button
                        text="Cancelar"
                        onClick={() => {
                          setIsEditingReceiver(false);
                          setIsNewReceiver(false);
                        }}
                        size="small"
                        color="#e63946"
                        textColor="white"
                      />
                    </div>
                  </FormSection>
                )}
              </div>
            </div>
            <div className="button-save">
              <Button
                text={isEditing ? "Guardar Cambios" : "Editar"}
                onClick={() => {
                  if (isEditing) {
                    updateClient();
                    updateReceiver(receptors[receiverIndexToEdit]);
                  } else {
                    setIsEditing(true);
                  }
                }}
                size="medium"
                color="#57cc99"
              />
              <Button
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
          </FormContainer>
        ) : (
          <p>Cargando datos del cliente...</p>
        )}
      </Modal>
    </div>
  );
};

export default ListClients;
