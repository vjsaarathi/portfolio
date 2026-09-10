import React, { useEffect, useState } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { experiences, skillCategories } from './data/resume';
import { Timeline } from './components/Timeline';
import { TimelineItem } from './components/TimelineItem';
import { SkillsRadar } from './components/SkillsRadar';
import { EducationCard } from './components/EducationCard';
import { DownloadCV } from './components/DownloadCV';
import '@impossible-resume/design-tokens/index.css';
import './styles/resume.css';

export function Resume() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    eventBus.emit('module:viewed', 'resume', { section: 'experience' });

    // Subscribe to scroll events from the Shell
    const unsubScroll = eventBus.subscribe('interaction:scroll', 'resume', (payload: any) => {
      if (payload && payload.data && typeof payload.data.scrollY === 'number') {
        setScrollY(payload.data.scrollY);
      }
    });

    return () => {
      unsubScroll();
    };
  }, []);

  const flatSkills = skillCategories.flatMap(cat => 
    cat.skills.map(s => ({
      ...s,
      category: cat.category
    }))
  ).slice(0, 8); // top 8 skills

  return (
    <section className="resume-section">
      <div className="resume-header">
        <div>
          <h2 className="section-title">Experience & Skills</h2>
          <p className="section-subtitle">
            N R Shyamsundar — Passionate Engineer focused on systems & architectural depth
          </p>
        </div>
        <DownloadCV />
      </div>

      <div className="resume-grid">
        {/* Timeline Column */}
        <div 
          className="timeline-wrapper" 
          style={{ transform: `translateY(${Math.min(scrollY * 0.05, 50)}px)`, transition: 'transform 0.1s ease-out' }}
        >
          <h3 className="timeline-heading">Engineering Journey</h3>
          <Timeline>
            {experiences.map((exp, idx) => (
              <TimelineItem
                key={idx}
                title={exp.role}
                company={exp.company}
                period={exp.period}
                description={exp.description.join(' ')}
                technologies={exp.skills}
                isActive={idx === 0}
              />
            ))}
          </Timeline>
          
          <h3 className="timeline-heading" style={{ marginTop: '2rem' }}>Education</h3>
          <EducationCard 
            degree="B.Tech in Computer Science" 
            institution="University of Technology" 
            period="2017 - 2021" 
          />
        </div>

        {/* Skills Radar Column */}
        <div className="skills-wrapper">
          <SkillsRadar skills={flatSkills} />
        </div>
      </div>
    </section>
  );
}

export default Resume;
