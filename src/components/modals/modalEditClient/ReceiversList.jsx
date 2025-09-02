import ButtonComponent from "../../button/Button";
import { FaPen } from "react-icons/fa6";

export default function ReceiversList({ receptors, isEditing, onEdit, onAdd }) {
  return (
    <div className="receptor-section">
      <h3>Receptores</h3>
      {receptors.length > 0 ? (
        receptors.map((r, i) => (
          <div key={i} className="receptor-item">
            <p>
              {r.firstName} {r.lastName} - {r.phone}
            </p>
            {isEditing && (
              <ButtonComponent
                onClick={() => onEdit(i)}
                size="extrasmall"
                color="#00b4d8"
                shape="circular"
                icon={<FaPen />}
              />
            )}
          </div>
        ))
      ) : (
        <p>No hay receptores registrados.</p>
      )}

      {isEditing && (
        <ButtonComponent
          onClick={onAdd}
          size="small"
          color="#00b4d8"
          text="Agregar"
        />
      )}
    </div>
  );
}
