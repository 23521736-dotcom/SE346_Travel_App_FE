import { apiClient } from './client';
import type { ApiOk } from './types';

export type NotificationType =
  | 'invited'
  | 'upcoming'
  | 'promotion'
  | 'like_comment'
  | 'place_approved'
  | 'place_rejected';

export type ApiNotificationItem = {
  id: string;
  notificationId?: string;
  type: NotificationType;
  targetId?: string;
  title?: string;
  body?: string;
  username?: string;
  itineraryName?: string;
  days?: number;
  placeName?: string;
  rejectionReason?: string;
  discount?: number;
  image?: string;
  time?: string;
  unread?: boolean;
  [key: string]: unknown;
};

export type NotificationTab = 'all' | 'unread';

export type ListNotificationsParams = {
  tab?: NotificationTab;
  limit?: number;
  offset?: number;
};

type NotificationsResponse =
  | ApiNotificationItem[]
  | {
    notifications?: ApiNotificationItem[];
    items?: ApiNotificationItem[];
    results?: ApiNotificationItem[];
    rows?: ApiNotificationItem[];
  };

type UnreadCountResponse =
  | number
  | {
    count?: number;
    unreadCount?: number;
    total?: number;
  };

function unwrapApiData<T>(payload: ApiOk<T> | T): T {
  return !payload || typeof payload !== 'object' || !('data' in payload)
    ? (payload as T)
    : payload.data;
}

function normalizeNotificationsResponse(data: NotificationsResponse | undefined): ApiNotificationItem[] {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.notifications ?? data?.items ?? data?.results ?? data?.rows ?? [];
}

function normalizeUnreadCount(data: UnreadCountResponse | undefined): number {
  if (typeof data === 'number') {
    return data;
  }

  return data?.unreadCount ?? data?.count ?? data?.total ?? 0;
}

export async function listNotifications(
  params: NotificationTab | ListNotificationsParams = 'all'
): Promise<ApiNotificationItem[]> {
  const query = typeof params === 'string' ? { tab: params } : params;
  const res = await apiClient.get<ApiOk<NotificationsResponse> | NotificationsResponse>('/notifications', {
    params: query,
  });
  const payload = unwrapApiData(res.data as ApiOk<NotificationsResponse> | NotificationsResponse);

  return normalizeNotificationsResponse(payload);
}

export async function getUnreadNotificationCount(): Promise<number> {
  const res = await apiClient.get<ApiOk<UnreadCountResponse> | UnreadCountResponse>(
    '/notifications/unread-count'
  );
  const payload = unwrapApiData(res.data as ApiOk<UnreadCountResponse> | UnreadCountResponse);

  return normalizeUnreadCount(payload);
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.patch('/notifications/read-all');
}

export async function deleteNotification(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}

export async function acceptNotificationInvite(id: string): Promise<unknown> {
  const res = await apiClient.post<ApiOk<unknown> | unknown>(`/notifications/${id}/accept`);

  return unwrapApiData(res.data as ApiOk<unknown> | unknown);
}

export async function declineNotificationInvite(id: string): Promise<unknown> {
  const res = await apiClient.post<ApiOk<unknown> | unknown>(`/notifications/${id}/decline`);

  return unwrapApiData(res.data as ApiOk<unknown> | unknown);
}
