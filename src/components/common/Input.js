import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  className = '',
  required = false,
  disabled = false,
  error = ''
}) => {
  return (
    <div className="input-group">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control ${className} ${error ? 'is-invalid' : ''}`}
        required={required}
        disabled={disabled}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string
};

export default Input;