import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className='form-group'>
      {label && (
        <label className='form-label'>
          {label}
        </label>
      )}
      <input
        className={`form-input ${className}`}
        {...props}
      />
      {error && (
        <span className='form-error'>{error}</span>
      )}
    </div>
  );
};

export default Input;
