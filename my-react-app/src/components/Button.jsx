import PropTypes from 'prop-types';
import './Button.css';

const Button = ({ text, onClick, variant = 'primary', disabled = false }) => {
  return (
    <button
      className={`custom-button ${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  disabled: PropTypes.bool,
};

export default Button;
