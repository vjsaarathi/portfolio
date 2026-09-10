import React from 'react';

interface ExperienceCardProps {
  title: string;
  company: string;
  period: string;
  highlights: string[];
}

export function ExperienceCard({ title, company, period, highlights }: ExperienceCardProps) {
  return (
    <div className="experience-card glass-card">
      <div className="experience-card__header">
        <h3 className="experience-card__title">{title}</h3>
        <span className="experience-card__period">{period}</span>
      </div>
      <p className="experience-card__company">{company}</p>
      <ul className="experience-card__highlights">
        {highlights.map((hl, i) => (
          <li key={i} className="experience-card__highlight">{hl}</li>
        ))}
      </ul>
    </div>
  );
}
