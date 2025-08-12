import "./ModalEditShipment.css";

import React, { useEffect, useMemo, useState } from "react";

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
  const [form, setForm] = useState(null);

  const normalizeBoxes = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    if (typeof value === "object")
      return Array.isArray(value) ? value : [value];
    return [];
  };

  useEffect(() => {
    if (!shipmentData) {
      setBoxes([]);
      setForm(null);
      return;
    }
    const nb = normalizeBoxes(shipmentData.boxes);
    setBoxes(nb);
    setForm({
      id: shipmentData.id,
      shipmentNumber: shipmentData.shipmentNumber || "",
      status: shipmentData.status || "",
      shipmentType: shipmentData.shipmentType || "",
      paymentMethod: shipmentData.paymentMethod || "",
      totalBoxes: shipmentData.totalBoxes ?? 0,
      totalWeight: shipmentData.totalWeight ?? 0,
      totalVolume: shipmentData.totalVolume ?? 0,
      declaredValue: shipmentData.declaredValue ?? 0,
      valuePaid: shipmentData.valuePaid ?? 0,
      isWithEnsurance: shipmentData.isWithEnsurance || "no",
      insuranceAmount: shipmentData.insuranceAmount ?? 0,
      boxes: nb,
      client: shipmentData.client,
      receiver: shipmentData.receiver,
      batch: shipmentData.batch,
      createdAt: shipmentData.createdAt,
    });
  }, [shipmentData]);

  useEffect(() => {
    if (form) setForm((p) => ({ ...p, boxes }));
  }, [boxes]); // eslint-disable-line react-hooks/exhaustive-deps

  const isMaritimo = useMemo(
    () => (form?.shipmentType || "").toLowerCase().includes("mar"),
    [form?.shipmentType]
  );

  if (!form) return null;

  const onNum = (fn) => (e) => fn(Number(e.target.value || 0));
  const onText = (fn) => (e) => fn(e.target.value);

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
        <h2 className="col-md-12 modal-title mb-2">Editar Envío</h2>
        <h6 className="col-md-12">
          Envío creado: {formatarFecha(form?.createdAt)}
        </h6>
        <h6 className="col-md-12">Estatus actual: {form?.status}</h6>
      </div>

      <div id="modal-content-pdf mb-5">
        <div className="modal-content">
          <div className="container">
            {/* Remitente (solo lectura) */}
            <div className="row">
              <h5 className="col-md-12 mt-3">Datos del Remitente:</h5>
              <div className="col-md-3">
                <Input
                  label="Nombre"
                  inputText={form?.client?.firstName || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Apellido"
                  inputText={form?.client?.lastName || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Teléfono"
                  inputText={form?.client?.phone || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Email"
                  inputText={form?.client?.email || ""}
                  readOnly
                  disabled
                />
              </div>

              {/* Receptor (solo lectura) */}
              <h5 className="col-md-12 mt-3">Datos del Receptor:</h5>
              <div className="col-md-3">
                <Input
                  label="Nombre"
                  inputText={form?.receiver?.firstName || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Apellido"
                  inputText={form?.receiver?.lastName || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="Teléfono"
                  inputText={form?.receiver?.phone || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-3">
                <Input
                  label="País"
                  inputText={form?.batch?.destinationCountry || ""}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-md-9">
                <Input
                  label="Dirección"
                  inputText={`${form?.receiver?.address || ""}, ${
                    form?.batch?.destinationCountry || ""
                  }`}
                  readOnly
                  disabled
                />
              </div>

              {/* Envío */}
              <h5 className="col-md-12 mt-3">Datos de Envío:</h5>

              <div className="col-md-3">
                <Input
                  label="Lote"
                  inputText={form?.batch?.batchNumber || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <Input
                  label="Número de Envío"
                  inputText={form?.shipmentNumber || ""}
                  readOnly
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Tipo de Envío</label>
                <input
                  className="form-control"
                  type="text"
                  value={form.shipmentType}
                  onChange={onText((v) =>
                    setForm((p) => ({ ...p, shipmentType: v }))
                  )}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Estatus</label>
                <input
                  className="form-control"
                  type="text"
                  value={form.status}
                  onChange={onText((v) =>
                    setForm((p) => ({ ...p, status: v }))
                  )}
                />
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-md-2">
                <label className="form-label">Total de cajas</label>
                <input
                  className="form-control"
                  type="number"
                  value={form.totalBoxes}
                  onChange={onNum((v) =>
                    setForm((p) => ({ ...p, totalBoxes: v }))
                  )}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Total de peso (lbs)</label>
                <input
                  className="form-control"
                  type="number"
                  value={form.totalWeight}
                  onChange={onNum((v) =>
                    setForm((p) => ({ ...p, totalWeight: v }))
                  )}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">
                  Total de volumen ({isMaritimo ? "ft³" : "ft²"})
                </label>
                <input
                  className="form-control"
                  type="number"
                  value={form.totalVolume}
                  onChange={onNum((v) =>
                    setForm((p) => ({ ...p, totalVolume: v }))
                  )}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Método de pago</label>
                <input
                  className="form-control"
                  type="text"
                  value={form.paymentMethod}
                  onChange={onText((v) =>
                    setForm((p) => ({ ...p, paymentMethod: v }))
                  )}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label d-block">Seguro</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isWithEnsurance === "si"}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        isWithEnsurance: e.target.checked ? "si" : "no",
                      }))
                    }
                  />
                  {form.isWithEnsurance === "si" && (
                    <div style={{ minWidth: 140 }}>
                      <label className="form-label">Monto asegurado</label>
                      <input
                        className="form-control"
                        type="number"
                        value={form.insuranceAmount}
                        onChange={onNum((v) =>
                          setForm((p) => ({ ...p, insuranceAmount: v }))
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Boxes (solo vista) */}
            <div className="row mt-4">
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
                  <div className="col-md-12">
                    <label className="form-label">Valor declarado ($)</label>
                    <input
                      className="form-control"
                      type="number"
                      value={form.declaredValue}
                      onChange={onNum((v) =>
                        setForm((p) => ({ ...p, declaredValue: v }))
                      )}
                    />
                  </div>

                  <div className="col-md-12 mt-2">
                    <label className="form-label">Valor pagado ($)</label>
                    <input
                      className="form-control"
                      type="number"
                      value={form.valuePaid}
                      onChange={onNum((v) =>
                        setForm((p) => ({ ...p, valuePaid: v }))
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <ButtonComponent
                className=""
                text="Cancelar"
                color="#e63946"
                onClick={() => setIsEditModalOpen(false)}
                type="button"
              />
              <ButtonComponent
                className="text-center"
                text="Guardar"
                color="#38b000"
                type="button"
                onClick={() => {
                  const payload = {
                    id: form.id,
                    shipmentNumber: form.shipmentNumber, // opcional si no lo editas
                    clientId: form.client?.id ?? form.clientId, // asegura IDs
                    batchId: form.batch?.id ?? form.batchId,
                    receiverId: form.receiver?.id ?? form.receiverId,

                    boxes: Array.isArray(form.boxes) ? form.boxes : [], // JSON en BD

                    totalWeight: Number(form.totalWeight || 0),
                    totalVolume: Number(form.totalVolume || 0),
                    totalBoxes: Number(form.totalBoxes || 0),
                    status: String(form.status || ""),

                    insurance: form.isWithEnsurance === "si" ? "si" : "no", // STRING
                    insuranceValue: String(form.insuranceAmount ?? "0"), // STRING

                    paymentMethod: String(form.paymentMethod || ""),
                    declaredValue: Number(form.declaredValue || 0),
                    valuePaid: Number(form.valuePaid || 0),
                    // NO mandes createdAt/updatedAt/createdBy/updatedBy desde el FE
                  };

                  handleSaveShipment?.(payload);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditShipment;
