import "./Login.css";

import { FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useContext, useEffect, useState } from "react";

import API_BASE_URL from "../../config/config";
import { AuthContext } from "../../contexts/AuthContext";
import ButtonComponent from "../button/Button";
import Input from "../inputs/InputComponent";
import Logo from "../../images/logosGC/logo-system.png";
import Select from "../select/SelectComponent";
import Swal from "sweetalert2";
import { companyOptions } from "../../utilities/options";
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
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      login(token);
      navigate("/");
    }
  }, [login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, company, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token;

        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("rememberMe", "true");
        } else {
          sessionStorage.setItem("token", token);
          localStorage.setItem("rememberMe", "false");
        }

        login(token);

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
            <Input
              inputType="email"
              placeholder="Email"
              value={email}
              inputText={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              width="100%"
            />
          </div>

          <div className="input-group password-group">
            <Input
              inputType={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              inputText={password}
              onChange={(e) => setPassword(e.target.value)}
              width="100%"
              required
            />
            <span className="toggle-password" onClick={toggleShowPassword}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="input-group">
            <Select
              value={company}
              placeholder="Selecciona una compania"
              inputText={company}
              onChange={(e) => setCompany(e.target.value)}
              options={companyOptions}
              required
            />
          </div>

          <div className="button-login-area">
            <ButtonComponent
              text="Login"
              size="medium"
              color="var(--color-secondary)"
            >
              {loading ? "Logging in..." : "Login"}
            </ButtonComponent>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
