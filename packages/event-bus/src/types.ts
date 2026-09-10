export interface EventPayload {
  type: string;
  source: string;           // Which module emitted this event
  timestamp: number;
  data?: unknown;
  id: string;               // Unique event ID for tracking
}

export interface EventSubscription {
  id: string;
  eventType: string;
  subscriber: string;       // Module name
  handler: (payload: EventPayload) => void;
}

export interface EventMiddleware {
  name: string;
  before?: (event: EventPayload) => EventPayload | null; // null = cancel
  after?: (event: EventPayload, subscribers: string[]) => void;
}

export interface EventBusMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsBySource: Record<string, number>;
  averageLatency: number;
  subscriberCount: number;
  lastEventTimestamp: number;
}
