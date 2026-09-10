import React from 'react';

interface RecoveryItem {
  module: string;
  status: 'affected' | 'recovering' | 'recovered';
  retryCount: number;
}

interface RecoveryStatusProps {
  items: RecoveryItem[];
}

export function RecoveryStatus({ items }: RecoveryStatusProps) {
  if (items.length === 0) {
    return (
      <div className="recovery-status recovery-status--empty">
        <p>All systems operational ✅</p>
      </div>
    );
  }

  return (
    <div className="recovery-status">
      <h4 className="recovery-status__title">Recovery Status</h4>
      {items.map((item) => (
        <div key={item.module} className={`recovery-status__item recovery-status__item--${item.status}`}>
          <span className="recovery-status__module">{item.module}</span>
          <span className="recovery-status__state">{item.status}</span>
          <span className="recovery-status__retries">Retries: {item.retryCount}</span>
        </div>
      ))}
    </div>
  );
}
