import "./ModalEditShipment.css";

import React, { useEffect, useState } from "react";

import ButtonComponent from "../../button/Button";
import Input from "../../inputs/InputComponent";
import Modal from "react-modal";
import { formatarFecha } from "../../../utilities/utilities";

Modal.setAppElement("#root");
const ModalEditShipment = (props) => {
  const {
    isEditModalOpen,
    closeModal,
    setIsEditModalOpen,
    shipmentData,
    handleSaveShipment,
  } = props;
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    if (shipmentData) setBoxes(JSON.parse(shipmentData.boxes));
  }, [shipmentData]);

  return (
    <Modal
      isOpen={isEditModalOpen}
      onRequestClose={closeModal}
      className={`modal ${isEditModalOpen ? "modal--open" : ""}`}
      overlayClassName={`modal-overlay ${
        isEditModalOpen ? "modal-overlay--open" : ""
      }`}
    >
      <div className="row m-3">
        <h2 className="col-md-12 modal-title mb-3">Editar Envío</h2>
        <h6 className="col-md-12 ">
          Envio creado: {formatarFecha(shipmentData?.createdAt)}
        </h6>
        <h6 className="col-md-12 ">
          Estatus del envio: {shipmentData?.status}
        </h6>
      </div>
      <div id="modal-content-pdf mb-5">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h5 className="col-md-12 mt-3">Datos del Remitente:</h5>
              <div className="col-md-3">
                <Input
                  label="Nombre"
                  inputText={shipmentData?.client?.firstName}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Apellido"
                  inputText={shipmentData?.client?.lastName}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Telefono"
                  inputText={shipmentData?.client?.phone}
                />
              </div>
              <div className="col-md-3">
                <Input label="Email " inputText={shipmentData?.client?.email} />
              </div>

              <h5 className="col-md-12 mt-3">Datos del Receptor:</h5>

              <div className="col-md-3">
                <Input
                  label="Nombre"
                  inputText={shipmentData?.receiver?.firstName}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Apellido"
                  inputText={shipmentData?.receiver?.lastName}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Telefono"
                  inputText={shipmentData?.receiver?.phone}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Pais"
                  inputText={shipmentData?.batch?.destinationCountry}
                />
              </div>
              <div className="col-md-9">
                <Input
                  label="Direccion"
                  inputText={`${shipmentData?.receiver?.address}, ${shipmentData?.batch?.destinationCountry}`}
                />
              </div>

              <h5 className="mt-3">Datos de Envio:</h5>

              <div className="col-md-3">
                <Input
                  label="Lote"
                  inputText={shipmentData?.batch?.batchNumber}
                />
              </div>

              <div className="col-md-3">
                <Input
                  label="Numero de Envio"
                  inputText={shipmentData?.shipmentNumber}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Tipo de Envio"
                  inputText={shipmentData?.shipmentType}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-2">
                <Input
                  label="Total de cajas"
                  inputText={shipmentData?.totalBoxes}
                />
              </div>

              <div className="col-md-2">
                <Input
                  label="Total de peso"
                  inputText={`${shipmentData?.totalWeight || ""} lbs`}
                />
              </div>

              <div className="col-md-2">
                <Input
                  label="Total de volumen"
                  inputText={`${shipmentData?.totalVolume || ""} ${
                    shipmentData?.shipmentType === "Marítimo" ? "ft³" : "ft²"
                  }`}
                />
              </div>

              <div className="col-md-3">
                <Input
                  label="Metodo de pago"
                  inputText={`${shipmentData?.paymentMethod}`}
                />
              </div>
              <div className="col-md-2">
                <label>Seguro:</label>
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(shipmentData?.isWithEnsurance === "si")}
                  />
                  {shipmentData?.isWithEnsurance && (
                    <Input
                      inputText={
                        shipmentData?.insuranceAmount === "si"
                          ? `$${shipmentData.amount || 0}`
                          : "$0.00"
                      }
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
                  {Array.isArray(boxes) && boxes.length > 0 ? (
                    boxes.map((box, index) => (
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
                    <Input
                      label="Valor declarado"
                      inputText={`$${shipmentData?.declaredValue}`}
                    />
                  </div>

                  <div className="col-md-6 offset-md-5">
                    <Input
                      label="Valor pagado"
                      inputText={`$${shipmentData?.valuePaid}`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className=" modal-actions">
              <ButtonComponent
                className=""
                text="Cancelar"
                color="#e63946"
                onClick={() => setIsEditModalOpen(false)}
              />
              <ButtonComponent
                className="text-center"
                text="Guardar"
                color="#38b000"
                onClick={handleSaveShipment}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditShipment;
