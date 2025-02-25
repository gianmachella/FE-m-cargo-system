import "./Acordion.css";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React, { useState } from "react";

import PropTypes from "prop-types";

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
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
  defaultOpen: PropTypes.bool,
};

export default Accordion;
