import React, { useState, useEffect } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { useDeveloperMode } from '../contexts/DeveloperModeContext';
import { DeveloperModeToggle } from './DeveloperModeToggle';
import { NRSSILogo } from './NRSSILogo';
import '../styles/navigation.css';

interface NavItem {
  label: string;
  route: string;
  order: number;
}

interface NavigationProps {
  items: NavItem[];
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export function Navigation({
  items,
  currentRoute,
  onNavigate,
}: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { developerMode } = useDeveloperMode();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      eventBus.emit('interaction:scroll', 'shell', { scrollY: window.scrollY });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (route: string) => {
    setMobileOpen(false);
    eventBus.emit('navigation:route_change', 'shell', { from: currentRoute, to: route });
    onNavigate(route);
  };

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''} ${developerMode ? 'nav--dev-mode' : ''}`}>
      <div className="nav__container">
        <a className="nav__logo" onClick={() => handleNavClick('/')} role="button" aria-label="NRSSI Home">
          <NRSSILogo />
          {developerMode && <span className="nav__logo-badge">DEV</span>}
        </a>

        {/* Desktop Navigation Links */}
        <div className="nav__links nav__links--desktop">
          {sortedItems.map((item) => {
            const isCurrent = currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route + '/'));
            return (
              <a
                key={item.route}
                href={`/portfolio${item.route}`}
                className={`nav__link ${isCurrent ? 'nav__link--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.route);
                }}
                role="button"
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className="nav__actions">
          <DeveloperModeToggle />

          {/* Mobile Hamburger Button */}
          <button
            className={`nav__hamburger ${mobileOpen ? 'nav__hamburger--active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Menu"
            type="button"
          >
            <span className="nav__hamburger-line"></span>
            <span className="nav__hamburger-line"></span>
            <span className="nav__hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Mobile Glassmorphism Navigation Drawer */}
      <div className={`nav__mobile-drawer ${mobileOpen ? 'nav__mobile-drawer--open' : ''}`}>
        <div className="nav__mobile-links">
          {sortedItems.map((item) => {
            const isCurrent = currentRoute === item.route || (item.route !== '/' && currentRoute.startsWith(item.route + '/'));
            return (
              <a
                key={item.route}
                href={`/portfolio${item.route}`}
                className={`nav__mobile-link ${isCurrent ? 'nav__mobile-link--active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.route);
                }}
                role="button"
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
