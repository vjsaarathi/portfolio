import React from 'react';

interface ConsoleFilterProps {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function ConsoleFilter({ filters, activeFilter, onFilterChange }: ConsoleFilterProps) {
  return (
    <div className="runtime-console__filters">
      {filters.map((f) => (
        <button
          key={f}
          className={`runtime-console__filter ${activeFilter === f ? 'runtime-console__filter--active' : ''}`}
          onClick={() => onFilterChange(f)}
        >
          {f.replace('_', ' ')}
        </button>
      ))}
    </div>
  );
}
