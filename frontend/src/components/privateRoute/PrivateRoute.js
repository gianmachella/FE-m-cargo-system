import React, { useContext } from "react";

import { AuthContext } from "../../contexts/AuthContext"; // Asegúrate de importar el AuthContext correctamente
import { Navigate } from "react-router-dom"; // Usamos Navigate en lugar de Redirect

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Si el usuario está autenticado, renderiza el componente hijo, si no, redirige al login
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
