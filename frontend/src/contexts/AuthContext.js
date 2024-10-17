import { createContext, useEffect, useState } from "react";

import jwtDecode from "jwt-decode"; // Correcta importación sin llaves

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token); // Usar jwtDecode correctamente

        if (decodedToken.exp * 1000 < Date.now()) {
          // Si el token ha expirado
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
        } else {
          setUser(decodedToken);
        }
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const login = (token) => {
    const decodedToken = jwtDecode(token); // Usar jwtDecode correctamente
    setUser(decodedToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
