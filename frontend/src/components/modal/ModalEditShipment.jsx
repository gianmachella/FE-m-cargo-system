import "./ModalEditShipment.css";

import ButtonComponent from "../button/Button";
import Input from "../inputs/InputComponent";
import Modal from "react-modal";
import React from "react";

Modal.setAppElement("#root");
const ModalEditShipment = (props) => {
  const {
    isEditModalOpen,
    closeModal,
    setIsEditModalOpen,
    dataSteepOne,
    dataSteepTwo,
    dataSteepThree,
    handleSaveShipment,
  } = props;

  return (
    <Modal
      isOpen={isEditModalOpen}
      onRequestClose={closeModal}
      className={`modal ${isEditModalOpen ? "modal--open" : ""}`}
      overlayClassName={`modal-overlay ${
        isEditModalOpen ? "modal-overlay--open" : ""
      }`}
    >
      <div className="row">
        <h2 className="col-md-6 modal-title ">Editar Envío</h2>
      </div>
      <div id="modal-content-pdf mb-5">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h5 className="col-md-12 mt-3">Datos del Remitente:</h5>
              <div className="col-md-5">
                <Input
                  label="Nombre completo"
                  inputText={`${dataSteepOne?.clientData?.firstName || ""} ${
                    dataSteepOne?.clientData?.lastName || ""
                  }`}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Telefono"
                  inputText={`${dataSteepOne?.clientData?.phone}`}
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Email "
                  inputText={`${dataSteepOne?.clientData?.email}`}
                />
              </div>

              <h5 className="col-md-12 mt-3">Datos del Receptor:</h5>

              <div className="col-md-5">
                <Input
                  label="Nombre completo"
                  inputText={`${dataSteepOne?.receiverData?.firstName || ""} ${
                    dataSteepOne?.clientData?.lastName || ""
                  }`}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Telefono"
                  inputText={`${dataSteepOne?.receiverData?.phone}`}
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Email "
                  inputText={`${dataSteepOne?.receiverData?.email}`}
                />
              </div>
              <div className="col-md-10">
                <Input
                  label="Direccion"
                  inputText={`${dataSteepOne?.receiverData?.address}`}
                />
              </div>
              <div className="col-md-2">
                <Input
                  label="Pais"
                  inputText={`${dataSteepOne?.receiverData?.country}`}
                />
              </div>

              <h5 className="mt-3">Datos de Envio:</h5>

              <div className="col-md-3">
                <Input
                  label="Lote"
                  inputText={`${dataSteepTwo?.batchNumber}`}
                />
              </div>

              <div className="col-md-3">
                <Input
                  label="Numero de Envio"
                  inputText={`${dataSteepThree?.shipmentNumber}`}
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Tipo de Envio"
                  inputText={`${dataSteepThree?.shipmentType}`}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-2">
                <Input
                  label="Total de cajas"
                  inputText={`${dataSteepThree?.totalBoxes}`}
                />
              </div>

              <div className="col-md-2">
                <Input
                  label="Total de peso"
                  inputText={`${dataSteepThree?.totalWeight || ""} lbs`}
                />
              </div>

              <div className="col-md-2">
                <Input
                  label="Total de volumen"
                  inputText={`${dataSteepThree?.totalVolume || ""} ${
                    dataSteepThree?.shipmentType === "Marítimo" ? "ft³" : "ft²"
                  }`}
                />
              </div>

              <div className="col-md-3">
                <Input
                  label="Metodo de pago"
                  inputText={`${dataSteepThree?.paymentMethod}`}
                />
              </div>
              <div className="col-md-2">
                <label>Seguro:</label>
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={Boolean(dataSteepThree?.isWithEnsurance === "si")}
                    disabled
                  />
                  {dataSteepThree?.isWithEnsurance && (
                    <Input
                      inputText={
                        dataSteepThree?.insuranceAmount === "si"
                          ? `$${dataSteepThree.amount || 0}`
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
                    <Input
                      label="Valor declarado"
                      inputText={`$${dataSteepThree?.declaredValue}`}
                    />
                  </div>

                  <div className="col-md-6 offset-md-5">
                    <Input
                      label="Valor pagado"
                      inputText={`$${dataSteepThree?.valuePaid}`}
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
