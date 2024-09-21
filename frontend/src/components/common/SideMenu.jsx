import "./SideMenu.css";

import {
  BsBarChartLineFill,
  BsBox2,
  BsBoxes,
  BsFillGearFill,
  BsPeopleFill,
} from "react-icons/bs";
import React, { useEffect, useState } from "react";

import Developer from "../developer/Developer";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/Language.context";

const SideMenu = ({ collapsed }) => {
  const { key } = useLanguage();
  const [collapsedMenu, setCollapsedMenu] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // Un estado para manejar todos los menús

  const handleShowMenu = (type) => {
    setActiveMenu((prev) => (prev === type ? null : type));
  };

  useEffect(() => {
    if (!collapsed) {
      setTimeout(() => {
        setCollapsedMenu(false);
      }, 600);
    } else {
      setCollapsedMenu(true);
    }
  }, [collapsed]);

  return (
    <div
      className={
        collapsed
          ? "side-menu sidemenu-container-collapsed"
          : "side-menu sidemenu-container"
      }
    >
      <ul className="menu">
        {/* Lotes */}
        <li className="item-menu-sidebar" onClick={() => handleShowMenu("lot")}>
          <BsBoxes className="icon-menu" />
          {!collapsedMenu && key?.admin_sidemenu_item_lots}
        </li>
        <ul
          className={`submenu${activeMenu === "lot" ? " submenu-active" : ""}`}
        >
          <Link className="text-item-menu" to="/admin/lot/create-lot">
            <li className="item-menu-sidebar">
              <BsBoxes className="icon-menu" />
              {!collapsedMenu && key?.admin_sidemenu_item_create_lot}
            </li>
          </Link>
          <Link className="text-item-menu" to="/admin/lot/update-lot">
            <li className="item-menu-sidebar">
              <BsBoxes className="icon-menu" />
              {!collapsedMenu && key?.admin_sidemenu_item_update_lot}
            </li>
          </Link>
        </ul>

        {/* Envíos */}
        <li
          className="item-menu-sidebar"
          onClick={() => handleShowMenu("ship")}
        >
          <BsBox2 className="icon-menu" />
          {!collapsedMenu && key?.admin_sidemenu_item_shipments}
        </li>
        <ul
          className={`submenu${activeMenu === "ship" ? " submenu-active" : ""}`}
        >
          <Link className="text-item-menu" to="/envios/crear">
            <li className="item-menu-sidebar">
              <BsBox2 className="icon-menu" />
              {!collapsedMenu && key?.admin_sidemenu_item_create_shipment}
            </li>
          </Link>
          <Link
            className="text-item-menu"
            to="/admin/shipment/consult-shipment"
          >
            <li className="item-menu-sidebar">
              <BsBox2 className="icon-menu" />
              {!collapsedMenu && key?.admin_sidemenu_item_consult_shipment}
            </li>
          </Link>
        </ul>

        {/* Clientes */}
        <li
          className="item-menu-sidebar"
          onClick={() => handleShowMenu("customer")}
        >
          <BsPeopleFill className="icon-menu" />
          {!collapsedMenu && key?.admin_sidemenu_item_users}
        </li>
        <ul
          className={`submenu${
            activeMenu === "customer" ? " submenu-active" : ""
          }`}
        >
          <Link className="text-item-menu" to="/admin/customer/create-customer">
            <li className="item-menu-sidebar">
              <BsPeopleFill className="icon-menu" />
              {!collapsedMenu && key?.admin_sidemenu_item_create_user}
            </li>
          </Link>
          <Link
            className="text-item-menu"
            to="/admin/customer/consult-customer"
          >
            <li className="item-menu-sidebar">
              <BsPeopleFill className="icon-menu" />
              {!collapsedMenu && key?.admin_sidemenu_item_update_user}
            </li>
          </Link>
        </ul>

        {/* Otros ítems del menú */}
        <li className="item-menu-sidebar">
          <BsBarChartLineFill className="icon-menu" />
          {!collapsedMenu && key?.admin_sidemenu_item_statistics}
        </li>
        <li className="item-menu-sidebar">
          <BsFillGearFill className="icon-menu" />
          {!collapsedMenu && key?.admin_sidemenu_item_settings}
        </li>
      </ul>

      {/* Pie de página */}
      {!collapsedMenu && (
        <div className="menu-footer">
          <p className="program-name">M-Cargo V-1.0</p>
          <p className="developer-name">Desarrollado por Gian Machella</p>
          <Developer />
        </div>
      )}
    </div>
  );
};

export default SideMenu;
