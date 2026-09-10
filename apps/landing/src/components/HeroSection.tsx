import React from 'react';
import { TypewriterEffect } from './TypewriterEffect';
import { ParticleBackground } from './ParticleBackground';
import { ScrollIndicator } from './ScrollIndicator';
import { eventBus } from '@impossible-resume/event-bus';

export function HeroSection() {
  return (
    <section className="hero" id="hero-section">
      <ParticleBackground />

      <div className="hero__content">
        <p className="hero__greeting animate-fade-in-up">Hello, I'm</p>
        <h1 className="hero__name animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          N R Shyamsundar
        </h1>
        <TypewriterEffect text="Passionate Engineer" />
        <p className="hero__description animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          I love solving complex engineering problems.
          From distributed KV stores with RAFT consensus to microfrontend architectures —
          if it requires architectural depth, I build it.
        </p>

        <div className="hero__cta animate-fade-in-up" style={{ animationDelay: '400ms' }}>
          <button
            className="hero__button hero__button--primary"
            onClick={() => eventBus.emit('navigation:trigger', 'landing', { route: '/projects' })}
          >
            Explore Projects
          </button>
          <button
            className="hero__button hero__button--ghost"
            onClick={() => eventBus.emit('navigation:trigger', 'landing', { route: '/resume' })}
          >
            View Resume
          </button>
        </div>

        <div className="hero__metrics glass-card animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="hero__metric">
            <span className="hero__metric-value">6+</span>
            <span className="hero__metric-label">Micro-Apps</span>
          </div>
          <div className="hero__metric">
            <span className="hero__metric-value">3</span>
            <span className="hero__metric-label">Frameworks</span>
          </div>
          <div className="hero__metric">
            <span className="hero__metric-value">1</span>
            <span className="hero__metric-label">Shared Event Bus</span>
          </div>
        </div>

        <ScrollIndicator />
      </div>
    </section>
  );
}
