import React, { useState } from 'react';
import './Tabs.css';

const Tabs = ({
  children,
  defaultValue,
  value: controlledValue,
  onValueChange,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className={`tabs ${className}`}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onValueChange: handleValueChange })
      )}
    </div>
  );
};

const TabsList = ({ children, className = '', value, onValueChange }) => (
  <div className={`tabs-list ${className}`}>
    {React.Children.map(children, child =>
      React.cloneElement(child, { value, onValueChange })
    )}
  </div>
);

const TabsTrigger = ({ children, tabValue, className = '', value, onValueChange }) => {
  const isActive = value === tabValue;
  const classes = [
    'tabs-trigger',
    isActive ? 'tabs-trigger--active' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={() => onValueChange(tabValue)}
      type="button"
    >
      {children}
    </button>
  );
};

const TabsContent = ({ children, tabValue, className = '', value }) => {
  if (value !== tabValue) return null;
  
  return (
    <div className={`tabs-content ${className}`}>
      {children}
    </div>
  );
};

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;