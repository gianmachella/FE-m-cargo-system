import "./Login.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useContext, useEffect, useState } from "react";

import { AuthContext } from "../../contexts/AuthContext";
import Logo from "../../images/logos/logo.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") === "true" // Verificar opción guardada
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir si ya hay un token activo
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      login(token);
      navigate("/"); // Redirige al dashboard u otra ruta segura
    }
  }, [login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, company, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;

        // Guardar token en el almacenamiento correcto según la opción "remember me"
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("rememberMe", "true"); // Guardar preferencia
        } else {
          sessionStorage.setItem("token", token);
          localStorage.setItem("rememberMe", "false");
        }

        login(token); // Actualiza el contexto de autenticación

        Swal.fire({
          icon: "success",
          title: "Login Successful",
          text: "Welcome!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => navigate("/"));
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img className="logo-login" src={Logo} alt="Logo" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="toggle-password" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group">
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            >
              <option value="">Selecciona una Compañía</option>
              <option value="company1">Global Cargo</option>
            </select>
          </div>

          <div className="input-group">
            <button className="login-button" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
