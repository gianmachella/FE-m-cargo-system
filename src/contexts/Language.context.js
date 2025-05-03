import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");
  const key = {
    admin_sidemenu_item_lots: "Lotes",
    admin_sidemenu_item_create_lot: "Crear Lote",
    admin_sidemenu_item_update_lot: "Actualizar Lote",
    admin_sidemenu_item_shipments: "Envíos",
    admin_sidemenu_item_create_shipment: "Crear Envío",
    admin_sidemenu_item_consult_shipment: "Consultar Envío",
    admin_sidemenu_item_users: "Clientes",
    admin_sidemenu_item_create_client: "Crear Cliente",
    admin_sidemenu_item_create_user: "Crear Usuario",
    admin_sidemenu_item_update_user: "Actualizar Cliente",
    admin_sidemenu_item_statistics: "Estadísticas",
    admin_sidemenu_item_settings: "Configuraciones",
  };

  return (
    <LanguageContext.Provider value={{ key, lan: language }}>
      {children}
    </LanguageContext.Provider>
  );
};
