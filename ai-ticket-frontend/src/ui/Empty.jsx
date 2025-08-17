import React from 'react';
import './Empty.css';

const Empty = ({
  title = 'No data',
  description,
  action,
  icon,
  className = '',
}) => {
  const defaultIcon = (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zM24 8c8.837 0 16 7.163 16 16s-7.163 16-16 16S8 32.837 8 24 15.163 8 24 8z" fill="currentColor" opacity="0.3"/>
      <path d="M24 16c-1.105 0-2 .895-2 2v8c0 1.105.895 2 2 2s2-.895 2-2v-8c0-1.105-.895-2-2-2zM24 30c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" fill="currentColor"/>
    </svg>
  );

  return (
    <div className={`empty ${className}`}>
      <div className="empty-icon">
        {icon || defaultIcon}
      </div>
      <h3 className="empty-title">{title}</h3>
      {description && <p className="empty-description">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
};

export default Empty;