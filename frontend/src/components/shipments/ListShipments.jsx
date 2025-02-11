import "./ListShipments.css";

import { FaPen, FaTrashCan } from "react-icons/fa6";
import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, usePagination, useTable } from "react-table";

import Button from "../button/Button";
import { FormContainer } from "../form/Form";
import Input from "../inputs/InputComponent";
import Modal from "react-modal";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const fetchShipments = async (page, search = "") => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const queryParams = new URLSearchParams({
    page: page,
    search: encodeURIComponent(search.trim()), // Evita caracteres especiales en la URL
  }).toString();

  const response = await fetch(
    `http://localhost:5000/api/shipments?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Error al obtener los envíos: ${response.statusText}`);
  }

  return response.json();
};

const ListShipments = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const response = await fetchShipments(page + 1, search);
      const { data, totalPages } = response;

      setShipments(data || []);
      setTotalPages(totalPages || 1);
    } catch (err) {
      setError("Error al cargar los envíos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, [page, search]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Número de Envío", accessor: "shipmentNumber" },
      { Header: "Cliente", accessor: "client.firstName" },
      { Header: "Estado", accessor: "status" },
      { Header: "Peso Total (lbs)", accessor: "totalWeight" },
      { Header: "Volumen Total (ft³)", accessor: "totalVolume" },
      { Header: "Total Cajas", accessor: "totalBoxes" },
      {
        Header: "Acciones",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              shape="circular"
              size="extrasmall"
              icon={<FaPen />}
              iconPosition="center"
              onClick={() => handleEdit(row.original)}
              color="#4cc9f0"
            />
            <Button
              shape="circular"
              size="extrasmall"
              icon={<FaTrashCan />}
              iconPosition="center"
              onClick={() => handleDelete(row.original.id)}
              color="#ef233c"
            />
          </div>
        ),
      },
    ],
    []
  );

  const handlePageChange = (selectedPage) => setPage(selectedPage.selected);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const handleEdit = (shipment) => {
    setSelectedShipment(shipment);
    setIsEditModalOpen(true);
  };

  const updateShipment = async (shipment) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/shipments/${shipment.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shipment),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el envío.");

      Swal.fire("Éxito", "Envío actualizado con éxito", "success");
      setIsEditModalOpen(false);
      loadShipments();
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el envío", "error");
    }
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (shipmentId) => {
    const confirmDelete = await Swal.fire({
      icon: "warning",
      title: "¿Estás seguro?",
      text: "¡Esta acción no se puede deshacer!",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminarlo",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await fetch(
          `http://localhost:5000/api/shipments/${shipmentId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Error al eliminar el envío.");

        await loadShipments();
        Swal.fire("¡Eliminado!", "El envío ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el envío", "error");
      }
    }
  };

  const tableInstance = useTable(
    { columns, data: shipments },
    useGlobalFilter,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="list-shipments-container">
      <h1>Envíos Registrados</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por número de envío o cliente..."
          value={search}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Cargando envíos...</p>
      ) : shipments.length > 0 ? (
        <table {...getTableProps()} className="shipments-table">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
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
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron envíos.</p>
      )}

      <ReactPaginate
        previousLabel={"Anterior"}
        nextLabel={"Siguiente"}
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
        className="modal"
        overlayClassName="modal-overlay"
      >
        {selectedShipment ? (
          <FormContainer>
            <h1>Editar Envío</h1>

            <Input
              label="Número de Envío"
              value={selectedShipment.shipmentNumber}
              onChange={(e) =>
                setSelectedShipment({
                  ...selectedShipment,
                  shipmentNumber: e.target.value,
                })
              }
            />

            <Input
              label="Estado"
              value={selectedShipment.status}
              onChange={(e) =>
                setSelectedShipment({
                  ...selectedShipment,
                  status: e.target.value,
                })
              }
            />

            <div className="button-save">
              <Button
                text="Guardar"
                onClick={() => updateShipment(selectedShipment)}
                size="medium"
                color="#57cc99"
              />
              <Button
                text="Cancelar"
                onClick={closeModal}
                size="medium"
                color="#e63946"
              />
            </div>
          </FormContainer>
        ) : (
          <p>Cargando datos del envío...</p>
        )}
      </Modal>
    </div>
  );
};

export default ListShipments;
