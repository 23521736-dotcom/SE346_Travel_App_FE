import type { ApiOk } from './types';
import { apiClient } from './client';
import type { ApiTrip } from './trips';

const TRIPS_PATH = '/trips';

export type TripMemberStatus = 'PENDING' | 'ACTIVE' | 'REJECTED' | 'REMOVED' | 'LEFT';

export type ApiTripMember = {
  id?: string | number;
  userId?: string | number;
  status?: TripMemberStatus | string;
  Status?: TripMemberStatus | string;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  user?: {
    id?: string | number;
    userId?: string | number;
    name?: string | null;
    fullName?: string | null;
    username?: string | null;
    email?: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
  } | null;
};

export type ApiTripInvitation = ApiTripMember & {
  tripId?: string | number;
  trip?: ApiTrip;
  invitedBy?: string | number;
  invitedByUser?: {
    id?: string | number;
    name?: string | null;
    fullName?: string | null;
    username?: string | null;
    avatar?: string | null;
    avatarUrl?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiTripMemberRecommendation = {
  userId: number;
  name: string;
  avatarUrl: string | null;
  commonTripCount: number;
  isInvitedByUser: boolean;
};

type TripInvitationsResponse =
  | ApiTripInvitation[]
  | {
    invitations?: ApiTripInvitation[];
    items?: ApiTripInvitation[];
    results?: ApiTripInvitation[];
    rows?: ApiTripInvitation[];
  };

type TripMemberRecommendationsResponse =
  | ApiTripMemberRecommendation[]
  | {
    recommendations?: ApiTripMemberRecommendation[];
    users?: ApiTripMemberRecommendation[];
    items?: ApiTripMemberRecommendation[];
    results?: ApiTripMemberRecommendation[];
    rows?: ApiTripMemberRecommendation[];
  };

function unwrapApiData<T>(payload: ApiOk<T> | T): T {
  return !payload || typeof payload !== 'object' || !('data' in payload)
    ? (payload as T)
    : payload.data;
}

function normalizeTripInvitationsResponse(data: TripInvitationsResponse | undefined): ApiTripInvitation[] {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.invitations ?? data?.items ?? data?.results ?? data?.rows ?? [];
}

function normalizeTripMemberRecommendationsResponse(
  data: TripMemberRecommendationsResponse | undefined
): ApiTripMemberRecommendation[] {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.recommendations ?? data?.users ?? data?.items ?? data?.results ?? data?.rows ?? [];
}

export async function fetchTripMemberRecommendations(
  tripId: string | number,
  userId: string | number,
  searchTerm = ''
): Promise<ApiTripMemberRecommendation[]> {
  const res = await apiClient.get<ApiOk<TripMemberRecommendationsResponse> | TripMemberRecommendationsResponse>(
    `${TRIPS_PATH}/${tripId}/members/recommendations/${userId}`,
    { params: { searchTerm } }
  );
  const payload = unwrapApiData(
    res.data as ApiOk<TripMemberRecommendationsResponse> | TripMemberRecommendationsResponse
  );

  return normalizeTripMemberRecommendationsResponse(payload);
}

export async function inviteTripMember(
  tripId: string | number,
  userId: string | number
): Promise<ApiTripMember> {
  const res = await apiClient.post<ApiOk<ApiTripMember> | ApiTripMember>(
    `${TRIPS_PATH}/${tripId}/members/invite`,
    { userId: Number(userId) }
  );

  return unwrapApiData(res.data as ApiOk<ApiTripMember> | ApiTripMember);
}

export async function removeTripInvitation(
  tripId: string | number,
  userId: string | number
): Promise<ApiTripMember> {
  const res = await apiClient.delete<ApiOk<ApiTripMember> | ApiTripMember>(
    `${TRIPS_PATH}/${tripId}/invitations/${userId}`
  );

  return unwrapApiData(res.data as ApiOk<ApiTripMember> | ApiTripMember);
}

export async function fetchMyTripInvitations(): Promise<ApiTripInvitation[]> {
  const res = await apiClient.get<ApiOk<TripInvitationsResponse> | TripInvitationsResponse>(
    '/me/trip-invitations'
  );
  const payload = unwrapApiData(res.data as ApiOk<TripInvitationsResponse> | TripInvitationsResponse);

  return normalizeTripInvitationsResponse(payload);
}

// export async function acceptTripInvitation(tripId: string | number): Promise<ApiTripMember> {
//   const res = await apiClient.post<ApiOk<ApiTripMember> | ApiTripMember>(
//     `${TRIPS_PATH}/${tripId}/invitations/accept`
//   );

//   return unwrapApiData(res.data as ApiOk<ApiTripMember> | ApiTripMember);
// }

// export async function rejectTripInvitation(tripId: string | number): Promise<ApiTripMember> {
//   const res = await apiClient.post<ApiOk<ApiTripMember> | ApiTripMember>(
//     `${TRIPS_PATH}/${tripId}/invitations/reject`
//   );

//   return unwrapApiData(res.data as ApiOk<ApiTripMember> | ApiTripMember);
// }

export async function removeTripMember(
  tripId: string | number,
  userId: string | number
): Promise<ApiTripMember> {
  const res = await apiClient.delete<ApiOk<ApiTripMember> | ApiTripMember>(
    `${TRIPS_PATH}/${tripId}/members/${userId}`
  );

  return unwrapApiData(res.data as ApiOk<ApiTripMember> | ApiTripMember);
}

export async function leaveTrip(
  tripId: string | number,
  userId: string | number
): Promise<ApiTripMember> {
  const res = await apiClient.patch<ApiOk<ApiTripMember> | ApiTripMember>(
    `${TRIPS_PATH}/${tripId}/members/${userId}/leave`
  );

  return unwrapApiData(res.data as ApiOk<ApiTripMember> | ApiTripMember);
}
