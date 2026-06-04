import { API_BASE_URL } from '../config';
import { getAccessToken } from '../api/client';
import type { RealtimeEventName, RealtimeMessage, RealtimePayload } from './events';

type Listener<TEvent extends RealtimeEventName = RealtimeEventName> = (
  payload: RealtimePayload<TEvent>
) => void;

type ConnectionState = 'idle' | 'connecting' | 'open' | 'closed';

const DEFAULT_RECONNECT_DELAYS = [1000, 2000, 5000, 10000, 15000];

function resolveRealtimeUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_REALTIME_URL?.trim();
  if (envUrl) {
    return envUrl;
  }

  const wsBaseUrl = API_BASE_URL.replace(/^http:/i, 'ws:').replace(/^https:/i, 'wss:');
  return `${wsBaseUrl.replace(/\/$/, '')}/ws`;
}

class RealtimeClient {
  private socket: WebSocket | null = null;
  private userId?: string | number;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private shouldReconnect = false;
  private state: ConnectionState = 'idle';
  private readonly listeners = new Map<string, Set<Listener>>();
  private readonly subscribedRooms = new Set<string>();

  get connectionState() {
    return this.state;
  }

  async connect(userId: string | number) {
    this.userId = userId;
    this.shouldReconnect = true;

    if (this.state === 'connecting' || this.state === 'open') {
      this.subscribeToUserRooms();
      return;
    }

    const token = await getAccessToken();
    const url = new URL(resolveRealtimeUrl());
    url.searchParams.set('userId', String(userId));
    if (token) {
      url.searchParams.set('token', token);
    }

    this.state = 'connecting';

    try {
      this.socket = new WebSocket(url.toString());
    } catch {
      this.state = 'closed';
      this.scheduleReconnect();
      return;
    }

    this.socket.onopen = () => {
      this.state = 'open';
      this.reconnectAttempt = 0;
      this.subscribeToUserRooms();
      this.flushRoomSubscriptions();
    };

    this.socket.onmessage = (message) => {
      this.handleMessage(message.data);
    };

    this.socket.onerror = () => {
      this.state = 'closed';
    };

    this.socket.onclose = () => {
      this.state = 'closed';
      this.socket = null;
      this.scheduleReconnect();
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    this.userId = undefined;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.state = 'closed';
  }

  subscribe<TEvent extends RealtimeEventName>(event: TEvent, listener: Listener<TEvent>) {
    const eventListeners = this.listeners.get(event) ?? new Set<Listener>();
    eventListeners.add(listener as Listener);
    this.listeners.set(event, eventListeners);

    return () => {
      const currentListeners = this.listeners.get(event);
      currentListeners?.delete(listener as Listener);
      if (currentListeners?.size === 0) {
        this.listeners.delete(event);
      }
    };
  }

  send(event: string, payload?: Record<string, unknown>) {
    if (this.socket?.readyState !== WebSocket.OPEN) {
      return;
    }

    this.socket.send(JSON.stringify({ event, payload }));
  }

  subscribeToTrip(tripId?: string | number) {
    if (!tripId) {
      return;
    }
    this.subscribeToRoom(`trip:${tripId}`);
  }

  subscribeToOwner(ownerId?: string | number) {
    if (!ownerId) {
      return;
    }
    this.subscribeToRoom(`owner:${ownerId}`);
  }

  private subscribeToUserRooms() {
    if (!this.userId) {
      return;
    }

    this.send('subscribe', { room: `user:${this.userId}` });
    this.send('subscribe', { room: `notifications:${this.userId}` });
  }

  private subscribeToRoom(room: string) {
    this.subscribedRooms.add(room);
    this.send('subscribe', { room });
  }

  private flushRoomSubscriptions() {
    this.subscribedRooms.forEach((room) => {
      this.send('subscribe', { room });
    });
  }

  private scheduleReconnect() {
    if (!this.shouldReconnect || this.reconnectTimer) {
      return;
    }

    const delay =
      DEFAULT_RECONNECT_DELAYS[Math.min(this.reconnectAttempt, DEFAULT_RECONNECT_DELAYS.length - 1)];
    this.reconnectAttempt += 1;

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (this.userId) {
        void this.connect(this.userId);
      }
    }, delay);
  }

  private handleMessage(rawData: unknown) {
    const messages = this.parseMessages(rawData);
    messages.forEach((message) => {
      const event = message.event ?? message.type;
      if (!event) {
        return;
      }

      const payload = message.payload ?? message.data ?? {};
      const eventListeners = this.listeners.get(event);
      eventListeners?.forEach((listener) => {
        listener(payload as RealtimePayload);
      });
    });
  }

  private parseMessages(rawData: unknown): RealtimeMessage[] {
    if (typeof rawData !== 'string') {
      return [];
    }

    try {
      const parsed = JSON.parse(rawData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [parsed];
    } catch {
      return [];
    }
  }
}

export const realtimeClient = new RealtimeClient();
