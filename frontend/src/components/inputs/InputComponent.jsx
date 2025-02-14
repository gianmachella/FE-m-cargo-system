import "./Input.css";

import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";

const Input = ({
  label = "",
  placeholder = "",
  leadingIcon = null,
  trailingIcon = null,
  padding = { top: 4, bottom: 4, left: 4, right: 4 },
  borderRadius = 10,
  borderColor = { valid: "#adb5bd", invalid: "#e63946" },
  borderWidth = 1,
  validationMessage = "",
  inputType = "text",
  inputText = "",
  onChange = () => {},
  isValid = true,
  name = "",
  disabled = false,
  height = "auto",
  width = "auto",
}) => {
  const [inputValue, setInputValue] = useState(inputText);
  const [valid, setValid] = useState(isValid);

  useEffect(() => {
    setInputValue(inputText);
  }, [inputText]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.length < 4) {
      setValid(false);
    } else {
      setValid(true);
    }
    onChange(e);
  };

  return (
    <div className="input-wrapper" style={{ width }}>
      {label && <label className="input-label">{label}</label>}
      <div
        className="input-container"
        style={{
          padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
          borderRadius: `${borderRadius}px`,
          border: `${borderWidth}px solid ${
            valid ? borderColor.valid : borderColor.invalid
          }`,
          height: height,
          width: width,
        }}
      >
        {leadingIcon && <span className="input-icon">{leadingIcon}</span>}
        <input
          className="styled-input"
          type={inputType}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          name={name}
          disabled={disabled}
          style={{ height: "100%" }}
        />
        {trailingIcon && <span className="input-icon">{trailingIcon}</span>}
      </div>
      {validationMessage && (
        <span className={`validation-message ${valid ? "valid" : "invalid"}`}>
          {validationMessage}
        </span>
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  leadingIcon: PropTypes.node,
  trailingIcon: PropTypes.node,
  padding: PropTypes.shape({
    top: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
    right: PropTypes.number,
  }),
  borderRadius: PropTypes.number,
  borderColor: PropTypes.shape({
    valid: PropTypes.string,
    invalid: PropTypes.string,
  }),
  borderWidth: PropTypes.number,
  validationMessage: PropTypes.string,
  inputType: PropTypes.string,
  inputText: PropTypes.string,
  onChange: PropTypes.func,
  isValid: PropTypes.bool,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  height: PropTypes.string,
};

export default Input;
