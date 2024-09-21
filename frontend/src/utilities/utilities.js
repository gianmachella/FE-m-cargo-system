/* eslint-disable import/no-anonymous-default-export */

export const formatOptions = (data, type) => {
  let options = [];
  switch (type) {
    case "conveyance":
      data.forEach((element) => {
        options.push({
          value: element.id,
          label: element.label,
        });
      });
      break;
    case "destinations":
      data.forEach((element) => {
        options.push({
          value: element.id,
          label: element.label,
        });
      });
      break;
    case "customerReceiving":
      data.forEach((element) => {
        options.push({
          value: element.id,
          label: element.name + " " + element.last_name,
        });
      });
      break;
    case "lot":
      data.forEach((element) => {
        options.push({ value: element.id, label: element.id });
      });
      break;
    case "receptor":
      data.forEach((element) => {
        options.push({ value: element.name, label: element.name });
      });
      break;
    case "status":
      data.forEach((element) => {
        options.push({ value: element.id, label: element.label });
      });
      break;

    default:
      break;
  }
  return options;
};

export const getVolume = (size) => {
  switch (size) {
    case "17X11X11 - Small":
      return 2.4;
      break;
    case "12X12X16 - Small":
      return 1.33;
      break;
    case "21X15X16 - Medium":
      return 2.92;
      break;
    case "18X18X16 - Medium":
      return 3;
      break;
    case "27X15X16 - Large":
      return 3.75;
      break;
    case "18X18X24 - Large":
      return 4.5;
      break;
    case "24X20X21 - ExtraLarge":
      return 5.83;
      break;
    case "22X22X21 - ExtraLarge":
      return 5.88;
      break;

    default:
      break;
  }
};

export const getTotalVolume = (boxList) => {
  let total = 0;
  boxList.forEach((box) => {
    total += getVolume(box.size);
  });
  return total;
};

export const getTotalWeigh = (boxList) => {
  let total = 0;
  boxList.forEach((box) => {
    total += Number(box.weigh);
  });
  return total;
};

export const getTotalWeighLot = (shipmentsList) => {
  let total = 0;
  shipmentsList.forEach((shipment) => {
    total += Number(shipment.weigh);
  });
  return total;
};

export const getTotalVolumeLot = (shipmentsList) => {
  let total = 0;
  shipmentsList.forEach((shipment) => {
    total += Number(shipment.volume);
  });
  return total;
};

export const getTotalBoxesLot = (shipmentsList) => {
  let total = 0;
  shipmentsList.forEach((shipment) => {
    total += Number(shipment.boxes);
  });
  return total;
};

export const getAuthToken = async () => {
  const myInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "api-token":
        "SZ6IXyRUxVfdtuC-zyedoXLLrSMT1X0p8SKtyXt9m5a9TqmCBOP-0Sgs4hdFmtq9e-Q",
      "user-email": "gianmachellaf@gmail.com",
    },
  };

  const myRequest = new Request(
    "https://www.universal-tutorial.com/api/getaccesstoken",
    myInit
  );

  return await fetch(myRequest, myInit).then((response) => response.json());
};

export const getCountries = async (token) => {
  const myInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const myRequest = new Request(
    "https://www.universal-tutorial.com/api/countries/",
    myInit
  );
  return await fetch(myRequest, myInit).then((response) => response.json());
};

export const getStates = async (token, country) => {
  console.log("country", country);
  const myInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const myRequest = new Request(
    `https://www.universal-tutorial.com/api/states/${country}`,
    myInit
  );
  return await fetch(myRequest, myInit).then((response) => response.json());
};

export const getCities = async (token, state) => {
  console.log("state", state);
  const myInit = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const myRequest = new Request(
    `https://www.universal-tutorial.com/api/cities/${state}`,
    myInit
  );
  return await fetch(myRequest, myInit).then((response) => response.json());
};

export const formatarFecha = (fechaISO, full) => {
  const fecha = new Date(fechaISO);
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const horas = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");
  const segundos = String(fecha.getSeconds()).padStart(2, "0");

  return `${dia}/${mes}/${año} ${
    full ? `${horas}:${minutos}:${segundos}` : ""
  }`;
};
