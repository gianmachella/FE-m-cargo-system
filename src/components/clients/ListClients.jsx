import "./ListClients.css";

import { FaPen, FaTrashCan } from "react-icons/fa6";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, usePagination, useTable } from "react-table";

import API_BASE_URL from "../../config/config";
import Button from "../button/Button";
import Modal from "react-modal";
import ModalEditClient from "../modals/modalEditClient/ModalEditClient";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const fetchClients = async (page, search) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/clients?page=${page}&search=${search || ""}`,
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
  const [receptors, setReceptors] = useState([]);

  const [isEditingReceiver, setIsEditingReceiver] = useState(false);

  const fetchReceiversByClientId = async (clientId) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `${API_BASE_URL}/api/clients/${clientId}/receivers`,
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
      return data;
    } catch (error) {
      console.error("Error al cargar los receptores:", error);
      Swal.fire("Error", "No se pudieron cargar los receptores", "error");
      return [];
    }
  };

  const handleEdit = async (client) => {
    try {
      const receivers = await fetchReceiversByClientId(client.id);
      setSelectedClient({ ...client, receivers });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error al cargar receptores:", error);
      Swal.fire("Error", "No se pudieron cargar los receptores.", "error");
    }
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
          `${API_BASE_URL}/api/clients/${clientId}`,
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
        `${API_BASE_URL}/api/clients/${selectedClient.id}`,
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

      const receivers = selectedClient.receivers || [];

      const existingReceivers = receivers.filter((receiver) => receiver.id);
      for (const receiver of existingReceivers) {
        console.log("Actualizando receptor:", receiver);
        await updateReceiver(receiver);
      }

      const newReceivers = receivers.filter((receiver) => !receiver.id);

      for (const newReceiver of newReceivers) {
        await createReceiver({ ...newReceiver, clientId: selectedClient.id });
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

      const response = await fetch(`${API_BASE_URL}/api/receivers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(receiver),
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
        `${API_BASE_URL}/api/receivers/${receiver.id}`,
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
      loadClients();
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

  return (
    <div className="list-clients-container">
      <h1>Clientes Registrados</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Busca por nombre, telefono o email..."
          value={search}
          onChange={handleSearch}
          style={{ width: "300px" }}
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
      <ModalEditClient
        isEditModalOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        selectedClient={selectedClient}
        updateClient={updateClient}
        updateReceiver={updateReceiver}
        createReceiver={createReceiver}
      />
    </div>
  );
};

export default ListClients;
