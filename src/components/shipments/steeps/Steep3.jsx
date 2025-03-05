import React, { useEffect, useState } from "react";
import {
  paymentMethods,
  shipmentTypeOptions,
  sizeBoxOptions,
} from "../../../utilities/options";

import ButtonComponent from "../../button/Button";
import { FaTrashCan } from "react-icons/fa6";
import { FormContainer } from "../../form/Form";
import Input from "../../inputs/InputComponent";
import RadioCheck from "../../radioCheck/RadioCheck";
import Select from "../../select/SelectComponent";
import Swal from "sweetalert2";

const Steep3 = (props) => {
  const {
    setDataSteepThree,
    handlePreviousStep,
    setShowConfirmationModal,
    batchData,
  } = props;

  const [shipmentNumber, setShipmentNumber] = useState("");
  const [totalWeight, setTotalWeight] = useState(0);
  const [totalBoxes, setTotalBoxes] = useState(0);
  const [boxes, setBoxes] = useState([]);
  const [newBox, setNewBox] = useState({ weight: "", size: "" });
  const [isWithEnsurance, setIsWithEnsurance] = useState("no");
  const [insuranceValue, setInsuranceValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [declaredValue, setDeclaredValue] = useState(null);
  const [valuePaid, setValuePaid] = useState(null);
  const [customSize, setCustomSize] = useState(false);

  const handleBoxAdd = () => {
    const weight = parseFloat(newBox.weight);
    const selectedSizeOption = sizeBoxOptions.find(
      (option) => option.value === newBox.size
    );

    if (isNaN(weight) || weight <= 0) {
      Swal.fire("Error", "El peso debe ser un número positivo.", "error");
      return;
    }

    if (!selectedSizeOption) {
      Swal.fire("Error", "Seleccione un tamaño de caja válido.", "error");
      return;
    }

    const volumeKey =
      batchData?.shipmentType === "Marítimo"
        ? "volumeM"
        : batchData?.shipmentType === "Aéreo"
        ? "volumeA"
        : null;

    if (!volumeKey) {
      Swal.fire("Error", "El tipo de envío no es válido.", "error");
      return;
    }

    setBoxes((prevBoxes) => [
      ...prevBoxes,
      { ...newBox, volume: selectedSizeOption[volumeKey] || 0 },
    ]);

    setNewBox({ weight: "", size: "" });

    setTimeout(() => {
      setNewBox({ weight: "", size: "" });
    }, 0);

    setTotalWeight((prev) => prev + weight);
    setTotalBoxes((prev) => prev + 1);
  };

  const handleBoxRemove = (index) => {
    const boxToRemove = boxes[index];

    setBoxes(boxes.filter((_, i) => i !== index));
    setTotalWeight((prev) => prev - parseFloat(boxToRemove.weight));
    setTotalBoxes((prev) => prev - 1);
  };

  const calculateTotalVolume = () => {
    if (!Array.isArray(boxes) || boxes.length === 0) {
      return "0.00";
    }

    const totalVolume = boxes.reduce((acc, box) => {
      const volume = parseFloat(box.volume);

      if (isNaN(volume)) {
        console.warn("Error: Volumen inválido en la caja:", box);
        return acc;
      }

      return acc + volume;
    }, 0);

    return totalVolume.toFixed(2);
  };

  const handleFinalize = () => {
    setShowConfirmationModal(true);
    setDataSteepThree({
      shipmentNumber,
      totalWeight,
      totalVolume: calculateTotalVolume(),
      totalBoxes,
      boxes,
      isWithEnsurance,
      insuranceValue,
      paymentMethod,
      declaredValue,
      valuePaid,
      customSize,
      shipmentType: batchData?.shipmentType,
    });
  };

  useEffect(() => {}, []);

  return (
    <FormContainer>
      <h2>Datos del Envío</h2>
      <div className="form-par">
        <Input
          label="Número de Envío"
          placeholder="Ingrese el número"
          value={shipmentNumber}
          onChange={(e) => setShipmentNumber(e.target.value)}
        />
        <Input
          label="Tipo de Envío"
          value={batchData?.shipmentType}
          inputText={batchData?.shipmentType}
          disabled
        />
      </div>
      <div className="form-par">
        <RadioCheck
          label="Seguro de Envío"
          name="insurance"
          selectedValue={isWithEnsurance}
          options={[
            { label: "Si", value: "si" },
            { label: "No", value: "no" },
          ]}
          onChange={(value) => setIsWithEnsurance(value)}
        />
        {isWithEnsurance === "si" && (
          <Input
            label="Monto del seguro"
            placeholder="Monto del seguro"
            value={insuranceValue}
            onChange={(e) => setInsuranceValue(e.target.value)}
          />
        )}

        <RadioCheck
          label="Tipo de Pago"
          name="paymentMethod"
          selectedValue={paymentMethod}
          options={paymentMethods}
          onChange={(value) => setPaymentMethod(value)}
        />
      </div>
      <div className="form-par">
        <Input
          label="Valor Declarado"
          placeholder="Ingrese el monto"
          value={declaredValue}
          onChange={(e) => setDeclaredValue(e.target.value)}
        />
        <Input
          label="Valor Pagado"
          placeholder="Ingrese el monto"
          value={valuePaid}
          onChange={(e) => setValuePaid(e.target.value)}
        />
      </div>
      <h4>Agregar cajas al envío:</h4>
      <div className="form-par">
        <Select
          label="Tamaño"
          value={newBox.size}
          options={sizeBoxOptions}
          onChange={(e) => {
            const size = e.target.value;
            setNewBox({ ...newBox, size });
            setCustomSize(size === "personality");
          }}
        />
        <Input
          label="Peso (lbs)"
          value={newBox.weight}
          onChange={(e) => setNewBox({ ...newBox, weight: e.target.value })}
        />
      </div>

      <ButtonComponent
        text="Agregar Caja"
        color="#0a91af"
        onClick={handleBoxAdd}
        disabled={
          newBox?.weight === "" ||
          newBox?.size === "" ||
          batchData?.shipmentType === ""
        }
      />
      <ul className="boxes-list">
        {boxes.map((box, index) => (
          <li key={index}>
            <div className="box-item">
              Tamaño: {box.size} - Peso: {box?.weight} lbs. - Volumen:{" "}
              {box?.volume}{" "}
              {batchData?.shipmentType === "Aéreo" ? "ft³" : "ft²"}
              <ButtonComponent
                color="#e63946"
                shape="circular"
                size="extrasmall"
                icon={<FaTrashCan />}
                iconPosition="center"
                onClick={() => handleBoxRemove(index)}
              />
            </div>
          </li>
        ))}
      </ul>

      <p>Total Cajas: {totalBoxes}</p>
      <p>Peso Total: {totalWeight.toFixed(2)} lbs</p>
      <p>
        Volumen Total: {calculateTotalVolume()}{" "}
        {batchData?.shipmentType === "Aéreo" ? "ft³" : "ft²"}
      </p>

      <div className="buttons-wizard">
        <ButtonComponent
          text="Anterior"
          color="#57cc99"
          onClick={handlePreviousStep}
        />
        <ButtonComponent
          text="Finalizar"
          color="#38b000"
          onClick={handleFinalize}
          disabled={
            boxes.length === 0 ||
            !shipmentNumber ||
            !declaredValue ||
            !valuePaid
          }
        />
      </div>
    </FormContainer>
  );
};

export default Steep3;
