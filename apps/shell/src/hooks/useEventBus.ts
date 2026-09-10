import { useEffect, useRef, useCallback } from 'react';
import { eventBus } from '@impossible-resume/event-bus';
import type { EventPayload } from '@impossible-resume/event-bus';

export function useEventBus(
  eventType: string,
  subscriber: string,
  handler: (payload: EventPayload) => void
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const unsubscribe = eventBus.subscribe(eventType, subscriber, (payload) => {
      handlerRef.current(payload);
    });
    return unsubscribe;
  }, [eventType, subscriber]);
}

export function useEventEmit() {
  return useCallback((type: string, source: string, data?: unknown) => {
    return eventBus.emit(type, source, data);
  }, []);
}
