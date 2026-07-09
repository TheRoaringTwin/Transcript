import React from 'react';

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
  warning: '⚠'
};

export default function StatusMessage({ message, type = 'info' }) {
  return (
    <div className={`status-message ${type}`}>
      <span className="status-icon">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
