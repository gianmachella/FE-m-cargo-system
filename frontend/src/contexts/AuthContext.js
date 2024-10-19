// src/contexts/AuthContext.js
import { createContext, useEffect, useState } from "react";

import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // Llamar useNavigate al principio

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          logout(); // Token expirado, cerrar sesión
        } else {
          setUser(decodedToken); // Usuario autenticado
        }
      } catch (error) {
        console.error("Invalid token", error);
        logout(); // Token inválido
      }
    } else {
      navigate("/login"); // Redirigir al login si no hay token
    }

    setLoading(false); // Finaliza la carga inicial
  }, [navigate]); // Asegura que useNavigate sea parte de las dependencias

  const login = (token) => {
    const decodedToken = jwtDecode(token);
    setUser(decodedToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login"); // Redirigir al login después del logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children} {/* Renderiza solo cuando termina la carga */}
    </AuthContext.Provider>
  );
};
