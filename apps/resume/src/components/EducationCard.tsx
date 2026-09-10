import React from 'react';

interface EducationCardProps {
  degree: string;
  institution: string;
  period: string;
  description?: string;
}

export function EducationCard({ degree, institution, period, description }: EducationCardProps) {
  return (
    <div className="education-card glass-card">
      <div className="education-card__icon">🎓</div>
      <div className="education-card__content">
        <h4 className="education-card__degree">{degree}</h4>
        <p className="education-card__institution">{institution}</p>
        <span className="education-card__period">{period}</span>
        {description && <p className="education-card__description">{description}</p>}
      </div>
    </div>
  );
}
