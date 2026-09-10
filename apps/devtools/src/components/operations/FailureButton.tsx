import React from 'react';

interface FailureButtonProps {
  label: string;
  description: string;
  isActive: boolean;
  onToggle: () => void;
}

export function FailureButton({ label, description, isActive, onToggle }: FailureButtonProps) {
  return (
    <button
      className={`failure-button ${isActive ? 'failure-button--active' : ''}`}
      onClick={onToggle}
    >
      <div className="failure-button__header">
        <span className="failure-button__label">{label}</span>
        <span className={`failure-button__status ${isActive ? 'failure-button__status--on' : ''}`}>
          {isActive ? 'ACTIVE' : 'OFF'}
        </span>
      </div>
      <p className="failure-button__description">{description}</p>
    </button>
  );
}
