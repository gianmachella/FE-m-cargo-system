import "./Nav.css";

import { BiBell, BiMenu, BiMessageDots, BiUserCircle } from "react-icons/bi";

import Button from "../button/Button";
import { FaLanguage } from "react-icons/fa6";
import React from "react";
import logo from "../../../src/images/logosGC/2.png";
import { useLanguage } from "../../contexts/Language.context";
import { useNavigate } from "react-router-dom";

const Nav = (props) => {
  const { collapse } = props;
  const { lan, setLanguage, key } = useLanguage() || {};
  const navigate = useNavigate();

  const languages = [
    {
      label: "English",
      action: () => setLanguage && setLanguage("en"), // Verifica que setLanguage esté disponible
    },
    {
      label: "Español",
      action: () => setLanguage && setLanguage("es"),
    },
  ];

  const userMenu = [
    {
      label: key?.admin_nav_item_settings || "Settings",
      action: () => console.log("Settings"),
    },
    {
      label: key?.admin_nav_item_profile || "Profile",
      action: () => console.log("Profile"),
    },
    {
      label: key?.admin_nav_item_logout || "Logout",
      action: () => console.log("Logout"),
    },
  ];

  const messages = [
    {
      user: "John Doe",
      subject: "Message 1",
    },
    {
      user: "Jane Doe",
      subject: "Message 2",
    },
  ];

  const notifications = [
    {
      notify: "Notification 1",
    },
    {
      notify: "Notification 2",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login"); // Redirige al usuario a la página de login
  };

  return (
    <nav className=" nav-container">
      <div className="nav-container-right">
        {/* Logo y Menú Colapsable */}
        <div className="left-side-nav">
          <a href="/">
            <img src={logo} width="150" className="m-1" alt="Logo" />
          </a>
          <div onClick={collapse}>
            <BiMenu className="icon-menu-collapse" />
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="logout-button"
          text="LOGOUT"
          size="extrasmall"
          color="var(--color-accent)"
        />

        {/* Menús */}
        <div className="menu-nav d-flex flex-row justify-content-around">
          <div className="d-flex flex-row justify-content-around"></div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
