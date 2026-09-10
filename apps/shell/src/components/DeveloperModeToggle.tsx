import React from 'react';
import { useDeveloperMode } from '../contexts/DeveloperModeContext';

export function DeveloperModeToggle() {
  const { developerMode, toggleDeveloperMode } = useDeveloperMode();

  return (
    <button
      className={`dev-mode-toggle ${developerMode ? 'dev-mode-toggle--active' : ''}`}
      onClick={toggleDeveloperMode}
      aria-label="Toggle Developer Mode"
      id="dev-mode-toggle"
    >
      <span className="dev-mode-toggle__icon">{'</>'}</span>
      <span className="dev-mode-toggle__label">Developer Mode</span>
      <span className={`dev-mode-toggle__indicator ${developerMode ? 'dev-mode-toggle__indicator--on' : ''}`} />
    </button>
  );
}
