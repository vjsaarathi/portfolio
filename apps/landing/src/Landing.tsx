import React, { useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { eventBus } from '@impossible-resume/event-bus';
import '@impossible-resume/design-tokens/index.css';
import './styles/landing.css';

export function Landing() {
  useEffect(() => {
    eventBus.emit('module:viewed', 'landing', { section: 'hero' });
  }, []);

  return <HeroSection />;
}

export default Landing;
