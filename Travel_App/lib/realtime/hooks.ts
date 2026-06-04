import { useEffect } from 'react';
import { realtimeClient } from './client';
import type { RealtimeEventName, RealtimePayload } from './events';

export function useRealtimeEvent<TEvent extends RealtimeEventName>(
  event: TEvent,
  listener: (payload: RealtimePayload<TEvent>) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    return realtimeClient.subscribe(event, listener);
  }, [enabled, event, listener]);
}

export function useRealtimeTripRoom(tripId?: string | number) {
  useEffect(() => {
    realtimeClient.subscribeToTrip(tripId);
  }, [tripId]);
}

export function useRealtimeOwnerRoom(ownerId?: string | number) {
  useEffect(() => {
    realtimeClient.subscribeToOwner(ownerId);
  }, [ownerId]);
}
