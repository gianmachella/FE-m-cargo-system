import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import CreateBatch from "./components/batches/CreateBatch";
import CreateClient from "./components/clients/CreateClient";
import CreateShipment from "./components/shipments/CreateShipment";
import Dashboard from "./pages/Dashboard";
import { LanguageProvider } from "./context/Language.context";
import ListBatches from "./components/batches/ListBatches";
import ListClients from "./components/clients/ListClients";
import ListShipments from "./components/shipments/ListShipments";
import MainLayout from "./components/layouts/MainLayout"; // Importa el layout
import React from "react";

function App() {
  return (
    <LanguageProvider>
      {" "}
      {/* Proveer el contexto de lenguaje a toda la aplicación */}
      <Router>
        <MainLayout>
          {" "}
          {/* El menú lateral siempre estará aquí */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lotes" element={<ListBatches />} />
            <Route path="/lotes/crear" element={<CreateBatch />} />
            <Route path="/clientes" element={<ListClients />} />
            <Route path="/clientes/crear" element={<CreateClient />} />
            <Route path="/envios" element={<ListShipments />} />
            <Route path="/envios/crear" element={<CreateShipment />} />
          </Routes>
        </MainLayout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
