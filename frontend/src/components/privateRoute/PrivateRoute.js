import { Navigate, Outlet } from "react-router-dom";
// src/components/PrivateRoute.js
import React, { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext";

const PrivateRoute = () => {
  const { user } = useContext(AuthContext);

  // Si el usuario está autenticado, renderiza el contenido, si no, redirige al login
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
