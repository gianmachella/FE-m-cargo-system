import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import CreateBatch from "./components/batches/CreateBatch";
import CreateClient from "./components/clients/CreateClient";
import CreateShipment from "./components/shipments/CreateShipment";
import Dashboard from "./pages/Dashboard";
import { LanguageProvider } from "./contexts/Language.context";
import ListBatches from "./components/batches/ListBatches";
import ListClients from "./components/clients/ListClients";
import ListShipments from "./components/shipments/ListShipments";
import Login from "./components/auth/Login";
import MainLayout from "./components/layouts/MainLayout"; // Importa el layout
import PrivateRoute from "./components/privateRoute/PrivateRoute"; // Importa PrivateRoute
import React from "react";

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            {/* La página de login no tiene el layout */}
            <Route path="/login" element={<Login />} />

            {/* Las demás rutas utilizan MainLayout para envolverlas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/lotes"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ListBatches />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/lotes/crear"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <CreateBatch />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/clientes"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ListClients />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/clientes/crear"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <CreateClient />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/envios"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ListShipments />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/envios/crear"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <CreateShipment />
                  </MainLayout>
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
