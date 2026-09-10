import React, { useEffect } from 'react';
import { TechBadge } from './TechBadge';
import type { Project } from '../data/projects';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="project-modal-backdrop" onClick={onClose}>
      <div className="project-modal glass-heavy animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button className="project-modal__close" onClick={onClose}>✕</button>
        <div className="project-modal__header">
          <h2 className="project-modal__title">{project.name}</h2>
          <TechBadge label={project.language} active />
        </div>
        <p className="project-modal__description">{project.description}</p>
        <div className="project-modal__topics">
          {project.topics.map((topic) => (
            <TechBadge key={topic} label={topic} />
          ))}
        </div>
        <div className="project-modal__actions">
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="project-modal__button hero__button hero__button--primary">
            View on GitHub →
          </a>
        </div>
      </div>
    </div>
  );
}
