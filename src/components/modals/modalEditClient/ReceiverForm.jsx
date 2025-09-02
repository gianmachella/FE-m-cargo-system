import ButtonComponent from "../../button/Button";
import { FormSection } from "../../form/Form";
import Input from "../../inputs/InputComponent";
import Select from "../../select/SelectComponent";

export default function ReceiverForm({
  receiver,
  onChange,
  onSave,
  onCancel,
  countryList,
  stateList,
  cityList,
  isEditing = false,
  isNew = false,
}) {
  return (
    <FormSection title={isNew ? "Nuevo Receptor" : "Editar Receptor"}>
      <Input
        label="Nombre"
        value={receiver.firstName || ""}
        onChange={(e) => onChange("firstName", e.target.value)}
      />
      <Input
        label="Apellido"
        value={receiver.lastName || ""}
        onChange={(e) => onChange("lastName", e.target.value)}
      />
      <Input
        label="Teléfono"
        value={receiver.phone || ""}
        onChange={(e) => onChange("phone", e.target.value)}
      />
      <Input
        label="Dirección"
        value={receiver.address || ""}
        onChange={(e) => onChange("address", e.target.value)}
      />

      <div className="form-par">
        <Select
          label="País"
          value={receiver.country || ""}
          onChange={(e) => onChange("country", e.target.value)}
          options={countryList.map((c) => ({ value: c.id, label: c.name }))}
        />

        {stateList.length > 0 && (
          <Select
            label="Estado/Provincia"
            value={receiver.state || ""}
            onChange={(e) => onChange("state", e.target.value)}
            options={stateList.map((s) => ({ value: s.id, label: s.name }))}
          />
        )}

        {cityList.length > 0 && (
          <Select
            label="Ciudad"
            value={receiver.city || ""}
            onChange={(e) => onChange("city", e.target.value)}
            options={cityList.map((ci) => ({ value: ci, label: ci }))}
          />
        )}
      </div>

      <div className="button-save">
        <ButtonComponent
          text={isNew ? "Agregar" : "Guardar Cambios"}
          onClick={onSave}
          size="small"
          color={isNew ? "#4cc9f0" : "#57cc99"}
        />
        <ButtonComponent
          text="Cancelar"
          onClick={onCancel}
          size="small"
          color={"#e63946"}
        />
      </div>
    </FormSection>
  );
}
