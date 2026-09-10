import React, { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RemoteLoader } from './components/RemoteLoader';
import { ScrollToTop } from './components/ScrollToTop';
import { SplashScreen } from './components/SplashScreen';
import { DeveloperModeProvider, useDeveloperMode } from './contexts/DeveloperModeContext';
import { EventBusProvider } from './contexts/EventBusContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { usePluginManifest } from './hooks/usePluginManifest';
import { eventBus, loggingMiddleware, latencyMiddleware } from '@impossible-resume/event-bus';
import { moduleTracker } from '@impossible-resume/runtime-tracker';

import '@impossible-resume/design-tokens/index.css';
import './styles/index.css';
import './styles/navigation.css';
import './styles/developer-mode.css';
import './styles/transitions.css';
import './styles/splash-screen.css';

function AppContent() {
  const { manifest } = usePluginManifest();
  const { developerMode } = useDeveloperMode();
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname === '/' || window.location.pathname === '/portfolio/' || window.location.pathname === '/portfolio' ? '/' : window.location.pathname.replace('/portfolio', ''));
  const [transitioning, setTransitioning] = useState(false);

  // Initialize event bus middleware and runtime tracker
  useEffect(() => {
    eventBus.use(loggingMiddleware);
    eventBus.use(latencyMiddleware);
    moduleTracker.startFpsMonitor();

    let lastMouseEvent = 0;
    const throttledMouseMove = () => {
      const now = Date.now();
      if (now - lastMouseEvent > 500) {
        lastMouseEvent = now;
        eventBus.emit('interaction:mousemove', 'shell', { timestamp: now });
      }
    };
    window.addEventListener('mousemove', throttledMouseMove, { passive: true });

    eventBus.emit('shell:initialized', 'shell', { timestamp: Date.now() });

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      moduleTracker.destroy();
    };
  }, []);

  // Browser URL sync — listen for popstate (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const route = path === '/' || path === '/portfolio/' || path === '/portfolio' ? '/' : path.replace('/portfolio', '');
      setCurrentRoute(route);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = useCallback((route: string) => {
    if (route === currentRoute) return;
    setTransitioning(true);
    moduleTracker.addEvent('route_change', 'shell', `Navigating to ${route}`);
    eventBus.emit('navigation:route_change', 'shell', { from: currentRoute, to: route });

    // Push to browser history
    const browserPath = route === '/' ? '/portfolio/' : `/portfolio${route}`;
    window.history.pushState({ route }, '', browserPath);

    setTimeout(() => {
      setCurrentRoute(route);
      setTransitioning(false);
    }, 300);
  }, [currentRoute]);

  // Listen for programmatic navigation from remotes (e.g. Hero CTA, Playground)
  useEffect(() => {
    const unsub = eventBus.subscribe('navigation:trigger', 'shell', (event: any) => {
      if (event?.data?.route) {
        handleNavigate(event.data.route);
      }
    });
    return () => unsub();
  }, [handleNavigate]);

  const activeRemote = manifest.find((r) => r.route === currentRoute || (r.route !== '/' && currentRoute.startsWith(r.route + '/')));
  const devToolsRemote = manifest.find((r) => r.name === 'devtools');
  const navItems = manifest
    .filter((r) => r.navLabel)
    .map((r) => ({ label: r.navLabel!, route: r.route, order: r.navOrder }));

  return (
    <div className={`app ${developerMode ? 'app--dev-mode' : ''}`}>
      <Navigation
        items={navItems}
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />

      <ScrollToTop route={currentRoute} />

      <main className={`main ${transitioning ? 'main--transitioning' : ''}`}>
        {/* Always render the active route section */}
        {activeRemote && (
          <div className={`main__content ${developerMode ? 'main__content--with-devtools' : ''}`}>
            <ErrorBoundary moduleName={activeRemote.name}>
              <RemoteLoader remote={activeRemote} />
            </ErrorBoundary>

            {/* Microfrontend Showcase on the Landing Page */}
            {currentRoute === '/' && manifest.find(r => r.name === 'blog') && manifest.find(r => r.name === 'playground') && (
              <div className="showcase-section" style={{ padding: 'var(--space-16) 0', borderTop: '1px solid var(--color-border-primary)', marginTop: 'var(--space-8)' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                    <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', padding: '4px 12px', background: 'var(--color-accent-subtle)', color: 'var(--color-accent-primary)', borderRadius: 'var(--radius-full)' }}>
                      Multi-Framework Orchestration
                    </span>
                  </div>
                  <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'var(--font-bold)', marginBottom: 'var(--space-4)', color: 'var(--color-text-primary)' }}>
                    Polyglot Microfrontends in Action
                  </h3>
                  <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 'var(--leading-relaxed)' }}>
                    Below is a live demonstration of Module Federation dynamically loading and mounting a <strong>Vue 3</strong> application and a <strong>Svelte 4</strong> application side-by-side within this React Shell.
                  </p>
                </div>

                <div className="showcase-grid">
                   {/* Vue 3 Remote */}
                   <div className="framework-wrapper glass-card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-primary)' }}>
                       <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-medium)' }}>apps/blog</span>
                       <span style={{ padding: '4px 12px', background: 'rgba(66,184,131,0.15)', color: 'var(--color-vue)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-vue)' }}></span> Vue 3
                       </span>
                     </div>
                     <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                       <ErrorBoundary moduleName="blog">
                         <RemoteLoader remote={manifest.find(r => r.name === 'blog')!} />
                       </ErrorBoundary>
                     </div>
                   </div>
                   
                   {/* Svelte 4 Remote */}
                   <div className="framework-wrapper glass-card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border-primary)' }}>
                       <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-md)', fontWeight: 'var(--font-medium)' }}>apps/playground</span>
                       <span style={{ padding: '4px 12px', background: 'rgba(255,62,0,0.15)', color: 'var(--color-svelte)', borderRadius: 'var(--radius-full)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--font-bold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                         <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-svelte)' }}></span> Svelte 4
                       </span>
                     </div>
                     <div style={{ maxHeight: '500px', overflowY: 'auto', overflowX: 'hidden' }}>
                       <ErrorBoundary moduleName="playground">
                         <RemoteLoader remote={manifest.find(r => r.name === 'playground')!} />
                       </ErrorBoundary>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DevTools overlay — rendered alongside, not replacing */}
        {developerMode && devToolsRemote && (
          <div className="devtools-overlay">
            <ErrorBoundary moduleName="devtools">
              <RemoteLoader remote={devToolsRemote} />
            </ErrorBoundary>
          </div>
        )}

        {/* 404 Fallback when no route matches */}
        {!activeRemote && (
          <div className="not-found-page" style={{ textAlign: 'center', padding: 'var(--space-16) var(--space-4)', marginTop: '10vh' }}>
            <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 'var(--font-bold)', color: 'var(--color-text-primary)', marginBottom: 'var(--space-4)' }}>404</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-lg)', marginBottom: 'var(--space-8)' }}>We couldn't find the page you were looking for.</p>
            <button onClick={() => handleNavigate('/')} className="hero__button hero__button--primary">
              Return Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <EventBusProvider>
        <DeveloperModeProvider>
          <SplashScreen>
            <AppContent />
          </SplashScreen>
        </DeveloperModeProvider>
      </EventBusProvider>
    </ThemeProvider>
  );
}
