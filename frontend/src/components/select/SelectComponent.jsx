import "./Select.css"; // Asegúrate de que este archivo esté presente y correctamente importado

import PropTypes from "prop-types";
import React from "react";

const Select = ({
  label = "",
  placeholder = "Selecciona una opción",
  options = [],
  value = "",
  onChange = () => {},
  name = "",
  disabled = false,
}) => {
  return (
    <div className="input-wrapper">
      {" "}
      {/* Usar la misma clase contenedora que `Input` */}
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {" "}
        {/* Usar el mismo contenedor que `Input` */}
        <select
          className="styled-input"
          value={value}
          onChange={onChange}
          name={name}
          disabled={disabled}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Select;
