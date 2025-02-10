import "./RadioCheck.css";

import PropTypes from "prop-types";
import React from "react";

const RadioCheck = ({
  label = "",
  name = "",
  options = [],
  selectedValue = "",
  onChange = () => {},
  direction = "row", // row o column
}) => {
  return (
    <div className="radio-check-container" style={{ flexDirection: direction }}>
      {label && <label className="radio-check-label">{label}</label>}
      <div className="radio-check-options">
        {options.map((option, index) => (
          <label key={index} className="radio-check-option">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

RadioCheck.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.string,
  onChange: PropTypes.func,
  direction: PropTypes.oneOf(["row", "column"]),
};

export default RadioCheck;
