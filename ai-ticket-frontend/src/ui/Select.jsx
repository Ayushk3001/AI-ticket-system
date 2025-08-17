import React from 'react';
import './Select.css';

const Select = ({
  label,
  error,
  helperText,
  children,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`select-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={selectId}
          className={`select ${error ? 'select--error' : ''}`}
          {...props}
        >
          {children}
        </select>
        <div className="select-icon">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      {error && <span className="select-error">{error}</span>}
      {helperText && !error && <span className="select-helper">{helperText}</span>}
    </div>
  );
};

export default Select;