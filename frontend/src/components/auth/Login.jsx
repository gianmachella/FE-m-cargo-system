import "./Login.css";

import React, { useState } from "react";

import Logo from "../../images/logos/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

  const navigate = useNavigate();

  // Función para manejar el submit del formulario de login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, company, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem("token", data.token);
        } else {
          sessionStorage.setItem("token", data.token);
        }

        navigate("/"); // Redirige al usuario a la página de inicio
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login"); // Redirige al usuario a la página de login
  };

  // Alternar mostrar/ocultar contraseña
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img className="logo-login" src={Logo} alt="" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <p className="error-message">{error}</p>}
          <div className="input-group">
            <i className="fas fa-user input-icon"></i>
            <input
              type="email"
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <i className="fas fa-lock input-icon"></i>
            <input
              type={showPassword ? "text" : "password"} // Cambia el tipo de input para mostrar/ocultar contraseña
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <i
              className={`fas ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } input-icon`} // Ícono de mostrar/ocultar contraseña
              onClick={toggleShowPassword}
              style={{ cursor: "pointer" }}
            ></i>
          </div>
          <div className="input-group">
            <i className="fas fa-building input-icon"></i>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            >
              <option value="">Select Company</option>
              <option value="company1">Company 1</option>
              <option value="company2">Company 2</option>
              <option value="company3">Company 3</option>
            </select>
          </div>
          <div className="remember-me">
            <div>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="forgot-password">
              Forgot Password?
            </a>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
