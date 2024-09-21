import "./MainLayout.css"; // Asegúrate de crear un archivo CSS para el layout

import Nav from "../common/Nav"; // Importa el componente Nav
import React from "react";
import SideMenu from "../common/SideMenu"; // Asegúrate de importar tu SideMenu correctamente

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed); // Alternar colapsar y expandir el menú
  };

  return (
    <div className="main-layout">
      <Nav collapse={handleCollapse} />{" "}
      {/* Coloca el Nav en la parte superior */}
      <div className="main-layout-body">
        <SideMenu collapsed={collapsed} />{" "}
        {/* El menú lateral siempre estará presente */}
        <div className={collapsed ? "main-content-collapsed" : "main-content"}>
          {children} {/* Aquí se renderizan las páginas */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
