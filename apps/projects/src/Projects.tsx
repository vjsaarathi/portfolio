import React, { useEffect, useState } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { projects, Project } from './data/projects';
import { ProjectGrid } from './components/ProjectGrid';
import { ProjectModal } from './components/ProjectModal';
import '@impossible-resume/design-tokens/index.css';
import './styles/projects.css';

export function Projects() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    eventBus.emit('module:viewed', 'projects', { count: projects.length });
  }, []);

  const languages = ['All', ...Array.from(new Set(projects.map((p) => p.language).filter(Boolean)))];

  const filteredProjects = selectedLanguage === 'All'
    ? projects
    : projects.filter((p) => p.language === selectedLanguage);

  const handleFilter = (lang: string) => {
    setSelectedLanguage(lang);
    eventBus.emit('interaction:filter', 'projects', { language: lang });
  };

  const handleProjectClick = (project: Project) => {
    setActiveProject(project);
    eventBus.emit('projects:selected', 'projects', { name: project.name, url: project.url });
  };

  return (
    <section className="projects-section">
      <div className="projects-header">
        <h2 className="section-title">Projects & Systems</h2>
        <p className="section-subtitle">
          Real repositories built across systems programming, distributed consensus, and microfrontends
        </p>

        <div className="language-filters">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`filter-badge ${selectedLanguage === lang ? 'filter-badge--active' : ''}`}
              onClick={() => handleFilter(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <ProjectGrid 
        projects={filteredProjects} 
        onSelectProject={handleProjectClick} 
      />

      {activeProject && (
        <ProjectModal 
          project={activeProject} 
          onClose={() => setActiveProject(null)} 
        />
      )}
    </section>
  );
}

export default Projects;
