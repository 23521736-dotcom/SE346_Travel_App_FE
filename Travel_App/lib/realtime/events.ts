import type { ApiNotificationItem } from '../api/notification';

export const REALTIME_EVENTS = {
  CONNECTED: 'realtime.connected',
  NOTIFICATION_CREATED: 'notification.created',
  NOTIFICATION_UPDATED: 'notification.updated',
  NOTIFICATION_DELETED: 'notification.deleted',
  NOTIFICATIONS_READ: 'notifications.read',
  NOTIFICATIONS_READ_ALL: 'notifications.read_all',
  TRIP_INVITATION_CREATED: 'trip.invitation.created',
  TRIP_INVITATION_ACCEPTED: 'trip.invitation.accepted',
  TRIP_INVITATION_DECLINED: 'trip.invitation.declined',
  TRIP_MEMBER_JOINED: 'trip.member.joined',
  TRIP_MEMBER_LEFT: 'trip.member.left',
  TRIP_UPDATED: 'trip.updated',
  TRIP_DELETED: 'trip.deleted',
  PLACE_SAVED: 'place.saved',
  PLACE_UNSAVED: 'place.unsaved',
  PLACE_REVIEW_CREATED: 'place.review.created',
  PLACE_REVIEW_UPDATED: 'place.review.updated',
  PLACE_REVIEW_DELETED: 'place.review.deleted',
  OWNER_DASHBOARD_UPDATED: 'owner.dashboard.updated',
} as const;

export type RealtimeEventName = (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];

export type RealtimeNotificationPayload = {
  notification?: ApiNotificationItem;
  notificationId?: string | number;
  recipientId?: string | number;
  unreadCount?: number;
};

export type RealtimeTripPayload = {
  tripId?: string | number;
  userId?: string | number;
  ownerId?: string | number;
  memberId?: string | number;
  actorId?: string | number;
};

export type RealtimePlacePayload = {
  placeId?: string | number;
  ownerId?: string | number;
  userId?: string | number;
  saved?: boolean;
  saves?: number;
  reviewId?: string | number;
  ratingCount?: number;
  averageRating?: number;
};

export type RealtimePayloadMap = {
  [REALTIME_EVENTS.CONNECTED]: { userId?: string | number };
  [REALTIME_EVENTS.NOTIFICATION_CREATED]: RealtimeNotificationPayload;
  [REALTIME_EVENTS.NOTIFICATION_UPDATED]: RealtimeNotificationPayload;
  [REALTIME_EVENTS.NOTIFICATION_DELETED]: RealtimeNotificationPayload;
  [REALTIME_EVENTS.NOTIFICATIONS_READ]: RealtimeNotificationPayload;
  [REALTIME_EVENTS.NOTIFICATIONS_READ_ALL]: RealtimeNotificationPayload;
  [REALTIME_EVENTS.TRIP_INVITATION_CREATED]: RealtimeTripPayload & RealtimeNotificationPayload;
  [REALTIME_EVENTS.TRIP_INVITATION_ACCEPTED]: RealtimeTripPayload;
  [REALTIME_EVENTS.TRIP_INVITATION_DECLINED]: RealtimeTripPayload;
  [REALTIME_EVENTS.TRIP_MEMBER_JOINED]: RealtimeTripPayload;
  [REALTIME_EVENTS.TRIP_MEMBER_LEFT]: RealtimeTripPayload;
  [REALTIME_EVENTS.TRIP_UPDATED]: RealtimeTripPayload;
  [REALTIME_EVENTS.TRIP_DELETED]: RealtimeTripPayload;
  [REALTIME_EVENTS.PLACE_SAVED]: RealtimePlacePayload;
  [REALTIME_EVENTS.PLACE_UNSAVED]: RealtimePlacePayload;
  [REALTIME_EVENTS.PLACE_REVIEW_CREATED]: RealtimePlacePayload;
  [REALTIME_EVENTS.PLACE_REVIEW_UPDATED]: RealtimePlacePayload;
  [REALTIME_EVENTS.PLACE_REVIEW_DELETED]: RealtimePlacePayload;
  [REALTIME_EVENTS.OWNER_DASHBOARD_UPDATED]: RealtimePlacePayload;
};

export type RealtimePayload<TEvent extends RealtimeEventName = RealtimeEventName> =
  TEvent extends keyof RealtimePayloadMap ? RealtimePayloadMap[TEvent] : Record<string, unknown>;

export type RealtimeMessage<TEvent extends RealtimeEventName = RealtimeEventName> = {
  event?: TEvent;
  type?: TEvent;
  payload?: RealtimePayload<TEvent>;
  data?: RealtimePayload<TEvent>;
};
