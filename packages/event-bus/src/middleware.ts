import { EventMiddleware, EventPayload } from './types';

/**
 * Logging middleware — logs all events to console with color coding.
 */
export const loggingMiddleware: EventMiddleware = {
  name: 'logging',
  before: (event: EventPayload) => {
    if (typeof window !== 'undefined' && (window as any).__DEV_MODE__) {
      console.log(
        `%c[EventBus] %c${event.source} %c→ %c${event.type}`,
        'color: #888',
        'color: #4fc3f7',
        'color: #888',
        'color: #81c784',
        event.data || ''
      );
    }
    return event;
  },
};

/**
 * Latency tracking middleware — measures time between emit and subscriber execution.
 */
export const latencyMiddleware: EventMiddleware = {
  name: 'latency',
  after: (event: EventPayload, subscribers: string[]) => {
    const latency = performance.now() - event.timestamp;
    (event as any).__latency = latency;
    (event as any).__subscriberCount = subscribers.length;
    (event as any).__subscribers = subscribers;
  },
};
