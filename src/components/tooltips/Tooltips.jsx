import "./Tooltips.css";

import React, { useState } from "react";

import PropTypes from "prop-types";

const Tooltip = ({
  text,
  children,
  position = "top",
  backgroundColor = "#333",
  textColor = "#fff",
  borderRadius = "4px",
  padding = "8px",
  fontSize = "14px",
  delay = 200,
}) => {
  const [visible, setVisible] = useState(false);
  let timeout;

  const showTooltip = () => {
    timeout = setTimeout(() => setVisible(true), delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div
          className={`tooltip tooltip-${position}`}
          style={{
            backgroundColor,
            color: textColor,
            borderRadius,
            padding,
            fontSize,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  backgroundColor: PropTypes.string,
  textColor: PropTypes.string,
  borderRadius: PropTypes.string,
  padding: PropTypes.string,
  fontSize: PropTypes.string,
  delay: PropTypes.number,
};

export default Tooltip;
