import { EventPayload, EventSubscription, EventMiddleware, EventBusMetrics } from './types';

let idCounter = 0;
function generateId(): string {
  return `evt_${Date.now()}_${++idCounter}`;
}

class EventBusImpl {
  private subscriptions: Map<string, EventSubscription[]> = new Map();
  private middleware: EventMiddleware[] = [];
  private history: EventPayload[] = [];
  private metrics: EventBusMetrics = {
    totalEvents: 0,
    eventsByType: {},
    eventsBySource: {},
    averageLatency: 0,
    subscriberCount: 0,
    lastEventTimestamp: 0,
  };

  /**
   * Subscribe to an event type.
   * Returns an unsubscribe function.
   */
  subscribe(
    eventType: string,
    subscriber: string,
    handler: (payload: EventPayload) => void
  ): () => void {
    const subscription: EventSubscription = {
      id: generateId(),
      eventType,
      subscriber,
      handler,
    };

    if (!this.subscriptions.has(eventType)) {
      this.subscriptions.set(eventType, []);
    }
    this.subscriptions.get(eventType)!.push(subscription);
    this.metrics.subscriberCount++;

    return () => {
      const subs = this.subscriptions.get(eventType);
      if (subs) {
        const idx = subs.findIndex((s) => s.id === subscription.id);
        if (idx !== -1) {
          subs.splice(idx, 1);
          this.metrics.subscriberCount--;
        }
      }
    };
  }

  /**
   * Emit an event. Runs through middleware, then dispatches to all subscribers.
   * Returns the list of subscriber names that received the event.
   */
  emit(type: string, source: string, data?: unknown): string[] {
    let event: EventPayload | null = {
      type,
      source,
      timestamp: performance.now(),
      data,
      id: generateId(),
    };

    // Run "before" middleware
    for (const mw of this.middleware) {
      if (mw.before) {
        event = mw.before(event);
        if (!event) return [];
      }
    }

    // Track metrics
    this.metrics.totalEvents++;
    this.metrics.eventsByType[type] = (this.metrics.eventsByType[type] || 0) + 1;
    this.metrics.eventsBySource[source] = (this.metrics.eventsBySource[source] || 0) + 1;
    this.metrics.lastEventTimestamp = event.timestamp;

    // Store in history (keep last 500 events)
    this.history.push(event);
    if (this.history.length > 500) {
      this.history.shift();
    }

    // Dispatch to subscribers
    const subscribers: string[] = [];
    const subs = this.subscriptions.get(type) || [];
    for (const sub of subs) {
      try {
        sub.handler(event);
        subscribers.push(sub.subscriber);
      } catch (err) {
        console.error(`[EventBus] Error in subscriber ${sub.subscriber} for ${type}:`, err);
      }
    }

    // Also dispatch to wildcard subscribers ('*')
    const wildcardSubs = this.subscriptions.get('*') || [];
    for (const sub of wildcardSubs) {
      try {
        sub.handler(event);
        subscribers.push(sub.subscriber);
      } catch (err) {
        console.error(`[EventBus] Error in wildcard subscriber ${sub.subscriber}:`, err);
      }
    }

    // Run "after" middleware
    for (const mw of this.middleware) {
      if (mw.after) {
        mw.after(event, subscribers);
      }
    }

    return subscribers;
  }

  /**
   * Add a middleware function.
   */
  use(middleware: EventMiddleware): void {
    this.middleware.push(middleware);
  }

  /**
   * Get event history (for time travel / replay).
   */
  getHistory(): EventPayload[] {
    return [...this.history];
  }

  /**
   * Get metrics snapshot.
   */
  getMetrics(): EventBusMetrics {
    return { ...this.metrics };
  }

  /**
   * Get all current subscriptions grouped by event type.
   */
  getSubscriptionMap(): Record<string, string[]> {
    const map: Record<string, string[]> = {};
    for (const [eventType, subs] of this.subscriptions) {
      map[eventType] = subs.map((s) => s.subscriber);
    }
    return map;
  }

  /**
   * Clear all history and reset metrics.
   */
  reset(): void {
    this.history = [];
    this.metrics = {
      totalEvents: 0,
      eventsByType: {},
      eventsBySource: {},
      averageLatency: 0,
      subscriberCount: this.metrics.subscriberCount,
      lastEventTimestamp: 0,
    };
  }
}

// Singleton — shared across all microfrontends via Module Federation shared scope
export const eventBus = new EventBusImpl();
