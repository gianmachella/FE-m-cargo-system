import "./Form.css";

import React from "react";

const FormSection = ({ title, children }) => {
  return (
    <div className="form-section">
      <h3>{title}</h3>
      {children}
    </div>
  );
};

const FormContainer = ({ children }) => {
  return <div className="form-container">{children}</div>;
};

export { FormContainer, FormSection };
