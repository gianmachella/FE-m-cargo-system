import { FormSection } from "../../form/Form";
import Input from "../../inputs/InputComponent";

export default function ClientForm({ clientData, isEditing, onChange }) {
  console.log("Data", clientData);

  return (
    <FormSection title={isEditing ? "Editar Cliente" : "Cliente"}>
      <Input
        disabled={!isEditing}
        label="Nombre"
        value={clientData.firstName || ""}
        inputText={clientData.firstName || ""}
        onChange={(e) => onChange("firstName", e.target.value)}
      />
      <Input
        disabled={!isEditing}
        label="Apellido"
        value={clientData.lastName || ""}
        inputText={clientData.lastName || ""}
        onChange={(e) => onChange("lastName", e.target.value)}
      />
      <Input
        disabled={!isEditing}
        label="Teléfono"
        value={clientData.phone || ""}
        inputText={clientData.phone || ""}
        onChange={(e) => onChange("phone", e.target.value)}
      />
      <Input
        disabled={!isEditing}
        label="Email"
        value={clientData.email || ""}
        inputText={clientData.email || ""}
        onChange={(e) => onChange("email", e.target.value)}
      />
    </FormSection>
  );
}
