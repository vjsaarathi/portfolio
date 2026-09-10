import React, { createContext, useContext, ReactNode } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import type { EventPayload } from '@impossible-resume/event-bus';

interface EventBusContextValue {
  emit: (type: string, source: string, data?: unknown) => string[];
  subscribe: (eventType: string, subscriber: string, handler: (payload: EventPayload) => void) => () => void;
  getHistory: () => EventPayload[];
}

const EventBusContext = createContext<EventBusContextValue>({
  emit: eventBus.emit.bind(eventBus),
  subscribe: eventBus.subscribe.bind(eventBus),
  getHistory: eventBus.getHistory.bind(eventBus),
});

export function EventBusProvider({ children }: { children: ReactNode }) {
  const value: EventBusContextValue = {
    emit: eventBus.emit.bind(eventBus),
    subscribe: eventBus.subscribe.bind(eventBus),
    getHistory: eventBus.getHistory.bind(eventBus),
  };
  return <EventBusContext.Provider value={value}>{children}</EventBusContext.Provider>;
}

export const useEventBusContext = () => useContext(EventBusContext);
