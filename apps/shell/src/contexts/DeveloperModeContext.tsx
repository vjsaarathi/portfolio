import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import { moduleTracker } from '@impossible-resume/runtime-tracker';

interface DeveloperModeContextValue {
  developerMode: boolean;
  toggleDeveloperMode: () => void;
}

const DeveloperModeContext = createContext<DeveloperModeContextValue>({
  developerMode: false,
  toggleDeveloperMode: () => {},
});

export function DeveloperModeProvider({ children }: { children: ReactNode }) {
  const [developerMode, setDeveloperMode] = useState(false);

  const toggleDeveloperMode = useCallback(() => {
    setDeveloperMode((prev) => {
      const next = !prev;
      (window as any).__DEV_MODE__ = next;
      moduleTracker.addEvent('interaction', 'shell', `Developer Mode ${next ? 'ENABLED' : 'DISABLED'}`);
      eventBus.emit('devmode:toggle', 'shell', { enabled: next });
      return next;
    });
  }, []);

  return (
    <DeveloperModeContext.Provider value={{ developerMode, toggleDeveloperMode }}>
      {children}
    </DeveloperModeContext.Provider>
  );
}

export function useDeveloperMode() {
  return useContext(DeveloperModeContext);
}
