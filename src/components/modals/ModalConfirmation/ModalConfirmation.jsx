import "./ModalConfirmation.css";

import ButtonComponent from "../../button/Button";
import Input from "../../inputs/InputComponent";
import Modal from "react-modal";
import React from "react";

Modal.setAppElement("#root");
const ModalConfirmation = (props) => {
  const {
    showConfirmationModal,
    setShowConfirmationModal,
    dataSteepOne,
    dataSteepTwo,
    dataSteepThree,
    handleSaveShipment,
  } = props;

  return (
    <Modal
      isOpen={showConfirmationModal}
      onRequestClose={() => setShowConfirmationModal(false)}
      className="custom-modal"
      overlayClassName="custom-modal-overlay"
    >
      <div className="row">
        <h2 className="col-md-12 modal-title ">Confirmar Envío</h2>
      </div>
      <div id="modal-content-pdf mb-5">
        <div className="modal-content">
          <div className="container">
            <div className="row">
              <h5 className="col-md-12 mt-3">Datos del Remitente:</h5>
              <div className="col-md-5">
                <Input
                  label="Nombre completo"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepOne.clientData?.firstName || ""} ${
                    dataSteepOne.clientData?.lastName || ""
                  }`}
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Telefono"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepOne.clientData?.phone}`}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <Input
                  label="Email "
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepOne.clientData?.email}`}
                  disabled
                />
              </div>

              <h5 className="col-md-12 mt-3">Datos del Receptor:</h5>

              <div className="col-md-5">
                <Input
                  label="Nombre completo"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepOne.receiverData?.firstName || ""} ${
                    dataSteepOne.clientData?.lastName || ""
                  }`}
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Telefono"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepOne.receiverData?.phone}`}
                  disabled
                />
              </div>
              <div className="col-md-4"></div>
              <div className="col-md-10">
                <Input
                  label="Direccion"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepOne.receiverData?.address} ${
                    dataSteepOne.receiverData?.city
                      ? dataSteepOne.receiverData?.city
                      : ""
                  } ${
                    dataSteepOne.receiverData?.state
                      ? dataSteepOne.receiverData?.state
                      : ""
                  } ${
                    dataSteepOne.receiverData?.country
                      ? dataSteepOne.receiverData?.country
                      : ""
                  }`}
                  disabled
                />
              </div>
              <div className="col-md-2">
                <Input
                  label="Pais"
                  height="35px"
                  borderRadius={5}
                  inputText={`${
                    dataSteepOne.receiverData?.country
                      ? dataSteepOne.receiverData?.country
                      : ""
                  }`}
                  disabled
                />
              </div>

              <h5 className="mt-3">Datos de Envio:</h5>

              <div className="col-md-3">
                <Input
                  label="Lote"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepTwo?.batchNumber}`}
                  disabled
                />
              </div>

              <div className="col-md-3">
                <Input
                  label="Numero de Envio"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepThree?.shipmentNumber}`}
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Tipo de Envio"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepThree?.shipmentType}`}
                  disabled
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-2">
                <Input
                  label="Total de cajas"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepThree?.totalBoxes}`}
                  disabled
                />
              </div>

              <div className="col-md-2">
                <Input
                  label="Total de peso"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepThree?.totalWeight || ""} lbs`}
                  disabled
                />
              </div>

              <div className="col-md-2">
                <Input
                  label="Total volumen"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepThree?.totalVolume || ""} ${
                    dataSteepThree?.shipmentType === "Marítimo" ? "ft³" : "ft²"
                  }`}
                  disabled
                />
              </div>

              <div className="col-md-3">
                <Input
                  label="Metodo de pago"
                  height="35px"
                  borderRadius={5}
                  inputText={`${dataSteepThree?.paymentMethod}`}
                  disabled
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
                      height="35px"
                      inputText={
                        dataSteepThree?.insuranceValue === "si"
                          ? `$${dataSteepThree.insuranceValue || 0}`
                          : "$0.00"
                      }
                      disabled
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
                      height="35px"
                      borderRadius={5}
                      inputText={`$${dataSteepThree?.declaredValue}`}
                      disabled
                    />
                  </div>

                  <div className="col-md-6 offset-md-5">
                    <Input
                      label="Valor pagado"
                      height="35px"
                      borderRadius={5}
                      inputText={`$${dataSteepThree?.valuePaid}`}
                      disabled
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
                onClick={() => setShowConfirmationModal(false)}
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

export default ModalConfirmation;
