import "./ListBatches.css";

import { FaPen, FaTrashCan } from "react-icons/fa6";
import { FormContainer, FormSection } from "../form/Form";
import React, { useEffect, useMemo, useState } from "react";
import {
  countryOptions,
  shipmentTypeOptions,
  statusOptions,
} from "../../utilities/options";
import { useGlobalFilter, usePagination, useTable } from "react-table";

import API_BASE_URL from "../../config/config";
import Button from "../button/Button";
import Input from "../inputs/InputComponent";
import Modal from "react-modal";
import ReactPaginate from "react-paginate";
import Select from "../select/SelectComponent";
import Swal from "sweetalert2";
import Tooltips from "../tooltips/Tooltips";

Modal.setAppElement("#root");

const fetchBatches = async (page, search) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/api/batches?page=${page}&search=${search || ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch batches.");

  const result = await response.json();

  return result;
};

const ListBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const loadBatches = async () => {
    setLoading(true);
    try {
      const response = await fetchBatches(page + 1, search);

      const { data, totalPages } = response;

      setBatches(data || []);
      setTotalPages(totalPages || 1);
    } catch (err) {
      console.error("Error loading batches:", err);
      setError("Error al cargar los lotes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, [page, search]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Número de Lote", accessor: "batchNumber" },
      { Header: "Destino", accessor: "destinationCountry" },
      { Header: "Estado", accessor: "status" },
      { Header: "Tipo de Envío", accessor: "shipmentType" },
      { Header: "Fecha de Creación", accessor: "createdAt" },
      {
        Header: "Acciones",
        accessor: "actions",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Tooltips text="Editar" position="top">
              <Button
                shape="circular"
                size="extrasmall"
                icon={<FaPen />}
                iconPosition="center"
                onClick={() => handleEdit(row.original)}
                color="#4cc9f0"
              />
            </Tooltips>
            <Tooltips text="Borrar" position="top">
              <Button
                shape="circular"
                size="extrasmall"
                icon={<FaTrashCan />}
                iconPosition="center"
                onClick={() => handleDelete(row.original.id)}
                color="#ef233c"
              />
            </Tooltips>
          </div>
        ),
      },
    ],
    []
  );

  const updateBatch = async (batch) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/batches/${batch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(batch),
      });

      if (!response.ok) throw new Error("Error al actualizar el lote.");

      Swal.fire("Éxito", "Lote actualizado con éxito", "success");
      setIsEditModalOpen(false);
      loadBatches();
    } catch (error) {
      Swal.fire(
        "Error",
        error.message || "No se pudo actualizar el lote",
        "error"
      );
    }
  };

  const tableInstance = useTable(
    { columns, data: batches },
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

  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBatch(null);
    setIsEditModalOpen(false);
  };

  const handleDelete = async (batchId) => {
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
        const response = await fetch(`${API_BASE_URL}/api/batches/${batchId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al eliminar el lote.");
        await loadBatches();
        Swal.fire("¡Eliminado!", "El lote ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el lote", "error");
      }
    }
  };

  return (
    <div className="list-batches-container">
      <h1>Lotes Registrados</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por número de lote o destino..."
          value={search}
          onChange={handleSearch}
          style={{ width: "300px" }}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Cargando lotes...</p>
      ) : batches.length > 0 ? (
        <table {...getTableProps()} className="batches-table">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  const { key, ...columnProps } = column.getHeaderProps();
                  return (
                    <th key={key} {...columnProps}>
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.length === 0 && (
              <tr>
                <td colSpan="6">No se encontraron lotes.</td>
              </tr>
            )}
            {rows.map((row) => {
              prepareRow(row);
              const { key, ...rowProps } = row.getRowProps();
              return (
                <tr key={key} {...rowProps}>
                  {row.cells.map((cell) => {
                    const { key, ...cellProps } = cell.getCellProps();
                    return (
                      <td key={key} {...cellProps}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No se encontraron lotes.</p>
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
        className={`modal ${isEditModalOpen ? "modal--open" : ""}`}
        overlayClassName={`modal-overlay ${
          isEditModalOpen ? "modal-overlay--open" : ""
        }`}
      >
        {selectedBatch ? (
          <FormContainer>
            <h1>Editar Lote</h1>

            <Input
              label="Número de Lote"
              value={selectedBatch.batchNumber}
              inputText={selectedBatch.batchNumber}
              onChange={(e) =>
                setSelectedBatch({
                  ...selectedBatch,
                  batchNumber: e.target.value,
                })
              }
            />

            <Select
              label="Destino"
              value={selectedBatch.destinationCountry}
              onChange={(e) =>
                setSelectedBatch({
                  ...selectedBatch,
                  destinationCountry: e.target.value,
                })
              }
              options={countryOptions}
            />

            <Select
              label="Estado"
              value={selectedBatch.status}
              onChange={(e) =>
                setSelectedBatch({ ...selectedBatch, status: e.target.value })
              }
              options={statusOptions}
            />

            <Select
              label="Tipo de Envío"
              value={selectedBatch.shipmentType}
              onChange={(e) =>
                setSelectedBatch({
                  ...selectedBatch,
                  shipmentType: e.target.value,
                })
              }
              options={shipmentTypeOptions}
            />

            <div className="button-save">
              <Button
                text="Guardar"
                onClick={() => updateBatch(selectedBatch)}
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
          <p>Cargando datos del lote...</p>
        )}
      </Modal>
    </div>
  );
};

export default ListBatches;
