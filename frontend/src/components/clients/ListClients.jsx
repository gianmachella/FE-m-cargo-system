import "./ListClients.css";

import React, { useEffect, useMemo, useState } from "react";
import { useGlobalFilter, usePagination, useTable } from "react-table";

import ReactPaginate from "react-paginate";

// Función para buscar clientes desde el backend
const fetchClients = async (page, search) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token"); // Obtener el token
  const response = await fetch(
    `http://localhost:5000/api/clients?page=${page}&search=${search || ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
      },
    }
  );
  const data = await response.json();
  return data;
};

const ListClients = () => {
  const [clients, setClients] = useState([]); // Valor inicial como array vacío
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await fetchClients(page + 1, search);
      setClients(data.data || []); // Asegurarse de que sea un array
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]); // En caso de error, asegúrate de que sea un array vacío
    } finally {
      setLoading(false);
    }
  };

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
            <button onClick={() => handleEdit(row.original)}>Edit</button>
            <button onClick={() => handleDelete(row.original.id)}>
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: clients }, // Asegúrate de que `data` siempre sea un array
    useGlobalFilter,
    usePagination
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  const handlePageChange = (selectedPage) => setPage(selectedPage.selected);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reinicia la paginación al buscar
  };

  const handleEdit = (client) => {
    console.log("Edit client:", client);
  };

  const handleDelete = async (clientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (confirmDelete) {
      await fetch(`http://localhost:5000/api/clients/${clientId}`, {
        method: "DELETE",
      });
      loadClients();
    }
  };

  return (
    <div className="list-clients-container">
      <h1>Clients List</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <p>Loading clients...</p>
      ) : (
        <table {...getTableProps()} className="clients-table">
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
    </div>
  );
};

export default ListClients;
