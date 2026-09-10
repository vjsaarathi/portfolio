import React from 'react';

interface TechBadgeProps {
  label: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
}

const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  Rust: '#f74c00',
  Java: '#b07219',
  Go: '#00add8',
  SCSS: '#c6538c',
  JavaScript: '#f7df1e',
  Python: '#3776ab',
};

export function TechBadge({ label, color, active, onClick }: TechBadgeProps) {
  const badgeColor = color || languageColors[label] || 'var(--color-accent-primary)';

  return (
    <span
      className={`tech-badge ${active ? 'tech-badge--active' : ''} ${onClick ? 'tech-badge--clickable' : ''}`}
      style={{
        borderColor: active ? badgeColor : 'var(--color-border-primary)',
        color: active ? badgeColor : 'var(--color-text-secondary)',
        backgroundColor: active ? `${badgeColor}15` : 'transparent',
      }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      {label}
    </span>
  );
}
