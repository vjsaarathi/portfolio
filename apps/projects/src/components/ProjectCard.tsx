import React from 'react';
import { eventBus } from '@impossible-resume/event-bus';

interface Project {
  name: string;
  description: string;
  language: string;
  url: string;
  stars: number;
  topics: string[];
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const getLanguageColor = (lang: string) => {
  switch (lang.toLowerCase()) {
    case 'rust': return '#f74c00';
    case 'java': return '#b07219';
    case 'go': return '#00add8';
    case 'scss': return '#c6538c';
    case 'typescript': return '#3178c6';
    default: return 'var(--color-accent-primary)';
  }
};

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <div
      className="project-card glass-card"
      onClick={onClick}
      onMouseEnter={() => eventBus.emit('interaction:hover', 'projects', { name: project.name })}
    >
      <div className="project-card__header">
        <span
          className="project-card__lang-dot"
          style={{ backgroundColor: getLanguageColor(project.language) }}
        />
        <span className="project-card__lang-name">{project.language}</span>
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="project-card__gh-link"
          onClick={(e) => {
            e.stopPropagation();
            eventBus.emit('interaction:github_click', 'projects', { url: project.url });
          }}
        >
          GitHub ↗
        </a>
      </div>

      <h3 className="project-card__title">{project.name}</h3>
      <p className="project-card__description">{project.description}</p>

      <div className="project-card__topics">
        {project.topics.map((topic) => (
          <span key={topic} className="project-card__topic-tag">
            #{topic}
          </span>
        ))}
      </div>
    </div>
  );
}
