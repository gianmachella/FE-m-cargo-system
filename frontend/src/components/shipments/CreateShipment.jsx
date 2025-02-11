import "./ShippingWizard.css";

import { BsBox2, BsBoxes } from "react-icons/bs";
import { Navigate, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import Button from "../button/Button";
import ButtonComponent from "../button/Button";
import { FaTrashCan } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import Modal from "react-modal";
import Select from "../select/SelectComponent";
import { Steep1 } from "./steeps/Steep1";
import Steep2 from "./steeps/Steep2";
import Steep3 from "./steeps/Steep3";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const handleDownloadPDF = () => {
    const modalContent = document.getElementById("modal-content-pdf");

    if (!modalContent) {
      console.error("Error: No se encontró el elemento modal-content-pdf");
      Swal.fire(
        "Error",
        "No se pudo generar el PDF. Intenta nuevamente.",
        "error"
      );
      return;
    }

    html2canvas(modalContent, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 190;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let position = 10;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        pdf.save("confirmacion_envio.pdf");
      })
      .catch((error) => {
        console.error("Error al generar el PDF:", error);
        Swal.fire("Error", "Hubo un problema al generar el PDF.", "error");
      });
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

      handleDownloadPDF();

      // const shipmentData = {
      //   batchId: dataSteepTwo.id,
      //   shipmentNumber: dataSteepThree.shipmentNumber,
      //   clientId: dataSteepOne.clientData.id,
      //   totalWeight: dataSteepThree.totalWeight,
      //   totalVolume: dataSteepThree.totalVolume,
      //   totalBoxes: dataSteepThree.totalBoxes,
      //   status: "recibido en almacen",
      //   receiverId: dataSteepOne.receiverData.id,
      //   createdBy: 1,
      //   updatedBy: 1,
      //   insurance: dataSteepThree.isWithEnsurance,
      //   paymentMethod: dataSteepThree.paymentMethod,
      //   declaredValue: dataSteepThree.declaredValue,
      //   valuePaid: dataSteepThree.valuePaid,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      //   boxes: JSON.stringify(dataSteepThree.boxes),
      // };

      // const response = await fetch("http://localhost:5000/api/shipments", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(shipmentData),
      // });

      // if (response.ok) {
      //   handleSendEmail(
      //     shipmentData,
      //     dataSteepOne.clientData,
      //     dataSteepOne.receiverData
      //   );
      //}

      // if (!response.ok) throw new Error("Error al guardar el envío.");

      // Swal.fire("¡Éxito!", "El envío ha sido registrado.", "success");
      // setShowConfirmationModal(false);
      // Navigate("/envios");
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
        <div id="modal-content-pdf">
          <div className="row">
            <h2 className="col-md-6 modal-title ">Confirmar Envío</h2>
            <img
              className="col-md-6"
              src="https://globalcargous.com/images/1.png"
              alt=""
            />
          </div>
          <div className="modal-content">
            <div className="container">
              <h5 className="mt-3">Datos Cliente:</h5>
              <div className="row">
                <div className="col-md-3">
                  <label>Nombre Remitente:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${dataSteepOne.clientData?.firstName || ""} ${
                      dataSteepOne.clientData?.lastName || ""
                    }`}
                    readOnly
                  />
                </div>

                <div className="col-md-3">
                  <label>Nombre Receptor:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${dataSteepOne.receiverData?.firstName || ""} ${
                      dataSteepOne.receiverData?.lastName || ""
                    }`}
                    readOnly
                  />
                </div>

                <div className="col-md-6">
                  <label>Dirección:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dataSteepOne.receiverData?.address || ""}
                    readOnly
                  />
                </div>
                <h5 className="mt-3">Datos de Envio:</h5>
                <div className="col-md-3">
                  <label>Lote:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dataSteepTwo?.batchNumber || ""}
                    readOnly
                  />
                </div>

                <div className="col-md-3">
                  <label>Número de Envío:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dataSteepThree?.shipmentNumber || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label>Tipo de Envío:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dataSteepThree?.shipmentType || ""}
                    readOnly
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-2">
                  <label>Total Cajas:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dataSteepThree?.totalBoxes || ""}
                    readOnly
                  />
                </div>

                <div className="col-md-2">
                  <label>Peso Total (lbs):</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${dataSteepThree?.totalWeight || ""} lbs`}
                    readOnly
                  />
                </div>

                <div className="col-md-2">
                  <label>Volumen Total:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={`${dataSteepThree?.totalVolume || ""} ${
                      dataSteepThree?.shipmentType === "Marítimo"
                        ? "ft³"
                        : "ft²"
                    }`}
                    readOnly
                  />
                </div>

                <div className="col-md-3">
                  <label>Método de Pago:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={dataSteepThree?.paymentMethod || ""}
                    readOnly
                  />
                </div>
                <div className="col-md-3">
                  <label>Seguro:</label>
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        dataSteepThree?.isWithEnsurance === "si"
                      )}
                      disabled
                    />
                    {dataSteepThree?.insurance && (
                      <input
                        type="text"
                        className="form-control ms-2"
                        value={
                          dataSteepThree?.insuranceAmount === "si"
                            ? `$${dataSteepThree.amount || 0}`
                            : "$0.00"
                        }
                        readOnly
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="row mt-5"></div>
              <div className="row">
                <div className="col-md-8">
                  <h3>Lista de Cajas:</h3>
                  <ul className="boxes-list">
                    {Array.isArray(dataSteepThree?.boxes) &&
                    dataSteepThree.boxes.length > 0 ? (
                      dataSteepThree.boxes.map((box, index) => (
                        <li key={index}>
                          <div className="box-item">
                            {box.size} - {box?.weight} lbs
                          </div>
                        </li>
                      ))
                    ) : (
                      <li>No hay cajas registradas</li>
                    )}
                  </ul>
                </div>

                <div className="col-md-4">
                  <div className="row mt-2">
                    <div className="col-md-6 offset-md-5">
                      <label>Valor Declarado:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={`$${dataSteepThree?.declaredValue || ""}`}
                        readOnly
                      />
                    </div>

                    <div className="col-md-6 offset-md-5">
                      <label>Valor Pagado:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={`$${dataSteepThree?.valuePaid || ""}`}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=" modal-actions">
            <Button
              className=""
              text="Cancelar"
              color="#e63946"
              onClick={() => setShowConfirmationModal(false)}
            />
            <Button
              className="text-center"
              text="Guardar"
              color="#38b000"
              onClick={handleSaveShipment}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShippingWizard;
