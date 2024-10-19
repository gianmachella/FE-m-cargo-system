// src/App.js
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
import MainLayout from "./components/layouts/MainLayout";
import PrivateRoute from "./components/privateRoute/PrivateRoute";

function App() {
  return (
    <LanguageProvider>
      <Router>
        {/* AuthProvider ahora está dentro de Router */}
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<PrivateRoute />}>
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                }
              />
              <Route
                path="/lotes"
                element={
                  <MainLayout>
                    <ListBatches />
                  </MainLayout>
                }
              />
              <Route
                path="/lotes/crear"
                element={
                  <MainLayout>
                    <CreateBatch />
                  </MainLayout>
                }
              />
              <Route
                path="/clientes"
                element={
                  <MainLayout>
                    <ListClients />
                  </MainLayout>
                }
              />
              <Route
                path="/clientes/crear"
                element={
                  <MainLayout>
                    <CreateClient />
                  </MainLayout>
                }
              />
              <Route
                path="/clients/edit/:clientId"
                element={
                  <MainLayout>
                    <CreateClient />
                  </MainLayout>
                }
              />
              <Route
                path="/envios"
                element={
                  <MainLayout>
                    <ListShipments />
                  </MainLayout>
                }
              />
              <Route
                path="/envios/crear"
                element={
                  <MainLayout>
                    <CreateShipment />
                  </MainLayout>
                }
              />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;
