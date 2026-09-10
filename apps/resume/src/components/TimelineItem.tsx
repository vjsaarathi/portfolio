import React from 'react';

interface TimelineItemProps {
  title: string;
  company: string;
  period: string;
  description: string;
  technologies: string[];
  isActive?: boolean;
}

export function TimelineItem({ title, company, period, description, technologies, isActive }: TimelineItemProps) {
  return (
    <div className={`timeline-item ${isActive ? 'timeline-item--active' : ''}`}>
      <div className="timeline-item__dot" />
      <div className="timeline-item__content glass-card">
        <div className="timeline-item__header">
          <h3 className="timeline-item__title">{title}</h3>
          <span className="timeline-item__period">{period}</span>
        </div>
        <p className="timeline-item__company">{company}</p>
        <p className="timeline-item__description">{description}</p>
        <div className="timeline-item__tech">
          {technologies.map((tech) => (
            <span key={tech} className="timeline-item__tech-tag">{tech}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
