import "./ShippingWizard.css";

import { BsBox2, BsBoxes } from "react-icons/bs";
import { Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Button from "../button/Button";
import { FaUser } from "react-icons/fa";
import Modal from "react-modal";
import { Steep1 } from "./steeps/Steep1";
import Steep2 from "./steeps/Steep2";
import Steep3 from "./steeps/Steep3";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const ShippingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [dataSteepOne, setDataSteepOne] = useState([]);
  const [dataSteepTwo, setDataSteepTwo] = useState([]);
  const [dataSteepThree, setDataSteepThree] = useState([]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSendEmail = async (shipmentData, clientData, receiverData) => {
    const response = await fetch("http://localhost:5000/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: clientData.email,
        data: shipmentData,
        subject: `Bienvenido ${clientData.firstName} ${clientData.lastName}}`,
        type: "newShipment",
        receiverData: receiverData,
        clientData: clientData,
      }),
    });

    const data = await response.json();
    console.log(data);
  };

  const handleSaveShipment = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      console.log(dataSteepOne);
      console.log(dataSteepTwo);
      console.log(dataSteepThree);

      const shipmentData = {
        batchId: dataSteepTwo.id,
        shipmentNumber: dataSteepThree.shipmentNumber,
        clientId: dataSteepOne.clientData.id,
        totalWeight: dataSteepThree.totalWeight,
        totalVolume: dataSteepThree.totalVolume,
        totalBoxes: dataSteepThree.totalBoxes,
        status: "recibido en almacen",
        receiverId: dataSteepOne.receiverData.id,
        createdBy: 1,
        updatedBy: 1,
        insurance: dataSteepThree.isWithEnsurance,
        paymentMethod: dataSteepThree.paymentMethod,
        declaredValue: dataSteepThree.declaredValue,
        valuePaid: dataSteepThree.valuePaid,
        createdAt: new Date(),
        updatedAt: new Date(),
        boxes: JSON.stringify(dataSteepThree.boxes),
      };

      const response = await fetch("http://localhost:5000/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shipmentData),
      });

      if (response.ok) {
        handleSendEmail(
          shipmentData,
          dataSteepOne.clientData,
          dataSteepOne.receiverData
        );
      }

      if (!response.ok) throw new Error("Error al guardar el envío.");

      Swal.fire("¡Éxito!", "El envío ha sido registrado.", "success");
      setShowConfirmationModal(false);
      Navigate("/envios");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="wizard-container">
      <h1>Registro de Envio</h1>
      <div className="steps-indicator">
        <hr
          className={`linea-personalizada ${currentStep >= 1 ? "active" : ""}`}
        />
        <div
          className={`icon-wrapper ${currentStep >= 1 ? "active" : ""}`}
          title="Paso 1: Seleccionar Cliente"
        >
          <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
            <FaUser />
          </div>
        </div>

        <hr
          className={`linea-personalizada ${currentStep >= 2 ? "active" : ""}`}
        />
        <div
          className={`icon-wrapper ${currentStep >= 2 ? "active" : ""}`}
          title="Paso 2: Seleccionar Lote"
        >
          <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
            <BsBoxes />
          </div>
        </div>

        <hr
          className={`linea-personalizada ${currentStep === 3 ? "active" : ""}`}
        />
        <div
          className={`icon-wrapper ${currentStep === 3 ? "active" : ""}`}
          title="Paso 3: Datos del Envío"
        >
          <div className={`step ${currentStep === 3 ? "active" : ""}`}>
            <BsBox2 />
          </div>
        </div>

        <hr
          className={`linea-personalizada ${currentStep === 3 ? "active" : ""}`}
        />
      </div>

      {currentStep === 1 && (
        <Steep1
          setDataSteepOne={setDataSteepOne}
          handleNextStep={handleNextStep}
        />
      )}
      {currentStep === 2 && (
        <Steep2
          handleNextStep={handleNextStep}
          handlePreviousStep={handlePreviousStep}
          setDataSteepTwo={setDataSteepTwo}
        />
      )}
      {currentStep === 3 && (
        <Steep3
          handlePreviousStep={handlePreviousStep}
          setDataSteepThree={setDataSteepThree}
          setShowConfirmationModal={setShowConfirmationModal}
        />
      )}
      <Modal
        isOpen={showConfirmationModal}
        onRequestClose={() => setShowConfirmationModal(false)}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <h2 className="modal-title">Confirmar Envío</h2>

        <div className="modal-content">
          <div className="modal-form-container">
            {/* Datos del Remitente */}
            <div className="form-group">
              <label>Nombre Remitente:</label>
              <input
                type="text"
                value={`${dataSteepOne.clientData?.firstName || ""} ${
                  dataSteepOne.clientData?.lastName || ""
                }`}
                readOnly
              />
            </div>

            {/* Datos del Receptor */}
            <div className="form-group">
              <label>Nombre Receptor:</label>
              <input
                type="text"
                value={`${dataSteepOne.receiverData?.firstName || ""} ${
                  dataSteepOne.receiverData?.lastName || ""
                }`}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Dirección:</label>
              <input
                type="text"
                value={dataSteepOne.receiverData?.address || ""}
                readOnly
              />
            </div>

            {/* Detalles del Envío */}
            <div className="form-group">
              <label>Lote:</label>
              <input
                type="text"
                value={dataSteepTwo?.batchNumber || ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Número de Envío:</label>
              <input
                type="text"
                value={dataSteepThree?.shipmentNumber || ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Total Cajas:</label>
              <input
                type="text"
                value={dataSteepThree?.totalBoxes || ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Peso Total (lbs):</label>
              <input
                type="text"
                value={dataSteepThree?.totalWeight || ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Volumen Total (ft³):</label>
              <input
                type="text"
                value={dataSteepThree?.totalVolume || ""}
                readOnly
              />
            </div>

            {/* Pago y Seguro */}
            <div className="form-group">
              <label>Valor Declarado:</label>
              <input
                type="text"
                value={dataSteepThree?.declaredValue || ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Valor Pagado:</label>
              <input
                type="text"
                value={dataSteepThree?.valuePaid || ""}
                readOnly
              />
            </div>
            <div className="form-group">
              <label>Método de Pago:</label>
              <select value={dataSteepThree?.paymentMethod || ""} disabled>
                <option value="">Seleccione un método</option>
                <option value="cash">Cash</option>
                <option value="zelle">Zelle</option>
                <option value="venmo">Venmo</option>
                <option value="otro">Otro</option>
              </select>
            </div>
            <div className="checkbox-group">
              <label>Seguro:</label>
              <input
                type="checkbox"
                checked={!!dataSteepThree?.insurance}
                disabled
              />
              {dataSteepThree?.insurance && (
                <input
                  type="text"
                  value={`$${
                    dataSteepThree && dataSteepThree.insuranceAmount === "si"
                      ? true
                      : false
                  }`}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <Button
            text="Cancelar"
            color="#e63946"
            onClick={() => setShowConfirmationModal(false)}
          />
          <Button text="Guardar" color="#38b000" onClick={handleSaveShipment} />
        </div>
      </Modal>
    </div>
  );
};

export default ShippingWizard;
