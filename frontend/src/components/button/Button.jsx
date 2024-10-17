import React from "react";

// El componente de botón
const ButtonComponent = ({
  text = "", // Texto dentro del botón
  color = "#00f", // Color del botón
  outlined = false, // Si es outlined o relleno sólido
  textColor = "#fff", // Color del texto en modo sólido
  borderRadius = "30px", // Borde redondeado
  icon = null, // Ícono JSX opcional
  iconPosition = "right", // Posición del ícono: 'left', 'right' o 'center'
  shape = "rectangular", // 'rectangular' o 'circular'
  size = "medium", // Tamaño del botón: 'small' o 'medium'
  onClick, // Función que se llama al hacer clic
  disabled = false, // Deshabilitar el botón si es necesario
  animate = true, // Animación en hover o clic
}) => {
  // Definir el tamaño del botón según la prop 'size'
  const sizeStyles = {
    extrasmall: {
      padding: "3px 6px",
      fontSize: "10px",
    },
    small: {
      padding: "6px 12px",
      fontSize: "14px",
    },
    medium: {
      padding: "10px 20px",
      fontSize: "16px",
    },
  };

  // Estilos para botones circulares
  const circularStyle =
    shape === "circular"
      ? {
          borderRadius: "50%", // Redondear completamente
          width: size === "small" ? "40px" : "extrasmall" ? "20px" : "60px", // Tamaños pequeños o medianos
          height: size === "small" ? "40px" : "extrasmall" ? "20px" : "60px",
          padding: 0, // Sin padding
          display: "flex",
          justifyContent: "center", // Centrar ícono en circular
          alignItems: "center",
          marginLeft: "10px",
        }
      : {};

  // Estilo base del botón
  const buttonStyle = {
    backgroundColor: outlined ? "transparent" : color, // Fondo
    color: outlined ? color : textColor, // Color del texto
    border: `2px solid ${color}`, // Borde
    borderRadius, // Borde redondeado
    padding: sizeStyles[size].padding, // Tamaño basado en 'size'
    fontSize: sizeStyles[size].fontSize, // Tamaño de fuente basado en 'size'
    cursor: disabled ? "not-allowed" : "pointer", // Cursor
    display: "flex", // Usamos flex para centrar el contenido
    alignItems: "center",
    justifyContent: iconPosition === "center" ? "center" : "space-between", // Centrar o distribuir ícono/texto
    opacity: disabled ? 0.5 : 1, // Opacidad si está deshabilitado
    transition: animate ? "transform 0.2s, box-shadow 0.2s" : "none", // Animaciones suaves
    ...circularStyle, // Añadir estilos circulares si aplica
  };

  // Estilo para el ícono
  const iconStyle = {
    marginLeft: iconPosition === "right" ? "8px" : "0",
    marginRight: iconPosition === "left" ? "8px" : "0",
  };

  // Estilo para animación en hover
  const hoverStyle = animate
    ? {
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", // Sombra en hover
        transform: "scale(1.05)", // Aumentar ligeramente el tamaño
      }
    : {};

  // Animación de click
  const handleMouseDown = (e) => {
    if (animate) {
      e.target.style.transform = "scale(0.95)"; // Hacer más pequeño al presionar
    }
  };

  const handleMouseUp = (e) => {
    if (animate) {
      e.target.style.transform = "scale(1)"; // Volver al tamaño original al soltar
    }
  };

  return (
    <button
      onClick={onClick}
      onMouseDown={handleMouseDown} // Animación de click
      onMouseUp={handleMouseUp} // Restaurar el tamaño
      onMouseEnter={(e) => {
        Object.assign(e.target.style, hoverStyle); // Aplicar animación en hover
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = "none"; // Quitar sombra al salir del hover
        e.target.style.transform = "scale(1)"; // Restaurar tamaño original
      }}
      style={buttonStyle}
      disabled={disabled}
    >
      {/* Solo mostrar el ícono centrado si la posición es 'center' */}
      {iconPosition === "center" && icon && <span>{icon}</span>}

      {/* Mostrar el ícono a la izquierda */}
      {iconPosition === "left" && icon && <span style={iconStyle}>{icon}</span>}

      {/* Mostrar texto si no es circular y la posición no es 'center' */}
      {shape !== "circular" && iconPosition !== "center" && text}

      {/* Mostrar el ícono a la derecha */}
      {iconPosition === "right" && icon && (
        <span style={iconStyle}>{icon}</span>
      )}
    </button>
  );
};

export default ButtonComponent;
