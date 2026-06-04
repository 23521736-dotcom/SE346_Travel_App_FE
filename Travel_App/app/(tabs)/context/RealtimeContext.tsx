import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getUnreadNotificationCount } from '../../../lib/api/notification';
import { realtimeClient } from '../../../lib/realtime/client';
import { REALTIME_EVENTS } from '../../../lib/realtime/events';
import { useRealtimeEvent } from '../../../lib/realtime/hooks';
import { useAuth } from './AuthContext';

type RealtimeContextData = {
  unreadCount: number;
  refreshUnreadCount: () => Promise<void>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
};

const RealtimeContext = createContext<RealtimeContextData>({
  unreadCount: 0,
  refreshUnreadCount: async () => undefined,
  setUnreadCount: () => undefined,
});

function RealtimeConnection({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const nextCount = await getUnreadNotificationCount();
      setUnreadCount(nextCount);
    } catch {
      setUnreadCount(0);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) {
      realtimeClient.disconnect();
      setUnreadCount(0);
      return;
    }

    void realtimeClient.connect(user.id);
    void refreshUnreadCount();

    return () => {
      realtimeClient.disconnect();
    };
  }, [refreshUnreadCount, user?.id]);

  const syncUnreadFromPayload = useCallback(
    (payload: { recipientId?: string | number; unreadCount?: number }) => {
      if (payload.recipientId && user?.id && String(payload.recipientId) !== String(user.id)) {
        return;
      }

      if (typeof payload.unreadCount === 'number') {
        setUnreadCount(Math.max(0, payload.unreadCount));
        return;
      }

      void refreshUnreadCount();
    },
    [refreshUnreadCount, user?.id]
  );

  useRealtimeEvent(REALTIME_EVENTS.NOTIFICATION_CREATED, syncUnreadFromPayload, Boolean(user?.id));
  useRealtimeEvent(REALTIME_EVENTS.NOTIFICATION_UPDATED, syncUnreadFromPayload, Boolean(user?.id));
  useRealtimeEvent(REALTIME_EVENTS.NOTIFICATION_DELETED, syncUnreadFromPayload, Boolean(user?.id));
  useRealtimeEvent(REALTIME_EVENTS.NOTIFICATIONS_READ, syncUnreadFromPayload, Boolean(user?.id));
  useRealtimeEvent(REALTIME_EVENTS.NOTIFICATIONS_READ_ALL, syncUnreadFromPayload, Boolean(user?.id));
  useRealtimeEvent(REALTIME_EVENTS.TRIP_INVITATION_CREATED, syncUnreadFromPayload, Boolean(user?.id));

  const value = useMemo(
    () => ({ unreadCount, refreshUnreadCount, setUnreadCount }),
    [refreshUnreadCount, unreadCount]
  );

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function RealtimeProvider({ children }: { children: ReactNode }) {
  return <RealtimeConnection>{children}</RealtimeConnection>;
}

export function useRealtimeNotifications() {
  return useContext(RealtimeContext);
}
