import "./Acordion.css";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";

const Accordion = ({
  title,
  children,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(controlledIsOpen ?? defaultOpen);

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
      console.log(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={handleToggle}>
        <h3>{title}</h3>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      {isOpen && <div className="accordion-content">{children}</div>}
    </div>
  );
};

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default Accordion;
