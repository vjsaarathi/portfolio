import React from 'react';

export function ScrollIndicator() {
  return (
    <div className="hero__scroll-indicator animate-fade-in-up" style={{ animationDelay: '600ms' }}>
      <span className="hero__scroll-text">Toggle Developer Mode in Nav to Inspect Architecture</span>
      <div className="hero__scroll-arrow" />
    </div>
  );
}
