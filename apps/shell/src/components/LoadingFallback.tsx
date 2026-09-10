import React from 'react';

interface LoadingFallbackProps {
  moduleName: string;
}

export function LoadingFallback({ moduleName }: LoadingFallbackProps) {
  return (
    <div className="remote-loading">
      <div className="remote-loading__spinner" />
      <p className="remote-loading__text">Loading {moduleName}...</p>
      <div className="remote-loading__skeleton">
        <div className="remote-loading__skeleton-line remote-loading__skeleton-line--wide" />
        <div className="remote-loading__skeleton-line remote-loading__skeleton-line--medium" />
        <div className="remote-loading__skeleton-line remote-loading__skeleton-line--narrow" />
      </div>
    </div>
  );
}
