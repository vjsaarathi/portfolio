import React from 'react';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../data/projects';

interface ProjectGridProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function ProjectGrid({ projects, onSelectProject }: ProjectGridProps) {
  return (
    <div className="projects-grid stagger-children">
      {projects.map((project) => (
        <ProjectCard
          key={project.name}
          project={project}
          onClick={() => onSelectProject(project)}
        />
      ))}
    </div>
  );
}
