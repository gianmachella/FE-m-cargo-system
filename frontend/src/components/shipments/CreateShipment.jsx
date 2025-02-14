import "./ShippingWizard.css";

import { BsBox2, BsBoxes } from "react-icons/bs";
import React, { useEffect, useState } from "react";

import { FaUser } from "react-icons/fa";
import Modal from "react-modal";
import ModalComfirmation from "../modal/ModalComfirmation";
import PDFFormat from "../PDFformat/PDFFormat";
import { Steep1 } from "./steeps/Steep1";
import Steep2 from "./steeps/Steep2";
import Steep3 from "./steeps/Steep3";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root");

const ShippingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [dataSteepOne, setDataSteepOne] = useState([]);
  const [dataSteepTwo, setDataSteepTwo] = useState([]);
  const [dataSteepThree, setDataSteepThree] = useState([]);
  const [showPDFContent, setShowPDFContent] = useState(false);

  const navigate = useNavigate();

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

      console.log(dataSteepOne);
      console.log(dataSteepTwo);
      console.log(dataSteepThree);

      const response = await fetch("http://localhost:5000/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) throw new Error("Error al guardar el envío.");

      Swal.fire("¡Éxito!", "El envío ha sido registrado.", "success");

      setShowPDFContent(true);

      handleSendEmail(
        shipmentData,
        dataSteepOne.clientData,
        dataSteepOne.receiverData
      );

      setShowConfirmationModal(false);
      handleDownloadPDF();
      setTimeout(() => {
        navigate("/envios");
      }, 3000);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDownloadPDF = async () => {
    const pdfContent = document.getElementById("pdf-content");

    if (!pdfContent) {
      Swal.fire(
        "Error",
        "No se pudo generar el PDF porque el contenido no existe.",
        "error"
      );
      return;
    }

    try {
      const canvas = await html2canvas(pdfContent, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`confirmacion_envio-${dataSteepThree.shipmentNumber}.pdf`);
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al generar el PDF.", "error");
    } finally {
      setShowPDFContent(false);
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
      <ModalComfirmation
        showConfirmationModal={showConfirmationModal}
        setShowConfirmationModal={setShowConfirmationModal}
        dataSteepOne={dataSteepOne}
        dataSteepTwo={dataSteepTwo}
        dataSteepThree={dataSteepThree}
        handleSaveShipment={handleSaveShipment}
      />
      {showPDFContent && (
        <header id="pdf-content">
          <PDFFormat
            dataSteepOne={dataSteepOne}
            dataSteepTwo={dataSteepTwo}
            dataSteepThree={dataSteepThree}
          />
        </header>
      )}
    </div>
  );
};

export default ShippingWizard;
