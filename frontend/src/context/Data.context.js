"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const Data = createContext();
export const useData = () => useContext(Data);

export const DataProvider = ({ children }) => {
  const [dataShipment, setDataShipment] = useState([]);

  return (
    <Data.Provider value={{ dataShipment, setDataShipment }}>
      {children}
    </Data.Provider>
  );
};
