import "./Nav.css";

import { BiBell, BiMenu, BiMessageDots, BiUserCircle } from "react-icons/bi";

import { FaLanguage } from "react-icons/fa6";
import React from "react";
import logo from "../../../src/images/logos/logo-hor.png";
import { useLanguage } from "../../context/Language.context";

const Nav = (props) => {
  const { collapse } = props;
  const { lan, setLanguage, key } = useLanguage() || {};

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

  return (
    <nav className="row nav-container navbar navbar-light bg-light shadow p-3 mb-5 bg-white rounded">
      <div className="col-md-12 d-flex flex-row justify-content-between">
        {/* Logo y Menú Colapsable */}
        <div className="left-side-nav">
          <img src={logo} width="150" height="50" className="m-0" alt="Logo" />
          <div onClick={collapse}>
            <BiMenu className="icon-menu-collapse" />
          </div>
        </div>

        {/* Menús */}
        <div className="menu-nav d-flex flex-row justify-content-around">
          <div className="d-flex flex-row justify-content-around">
            <p className="mt-1">John Doe</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
