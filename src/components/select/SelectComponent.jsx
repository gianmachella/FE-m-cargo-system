import "./Select.css";

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
  width = "100%", // Nueva propiedad para personalizar el ancho
}) => {
  return (
    <div className="input-wrapper" style={{ width }}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
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
      value: PropTypes.any,
    })
  ),
  value: PropTypes.any,
  onChange: PropTypes.func,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.string, // Validación del ancho personalizado
};

export default Select;
