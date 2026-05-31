import type { ApiOk, ApiUser } from './types';
import { apiClient } from './client';

export async function fetchMe(): Promise<ApiUser> {
  const res = await apiClient.get<ApiOk<ApiUser>>('/users/me');
  return res.data.data;
}

export async function updateMe(body: {
  email?: string;
  fullName?: string;
  username?: string;
  location?: string;
  avatarUrl?: string;
}): Promise<ApiUser> {
  const res = await apiClient.patch<ApiOk<ApiUser>>('/users/me', body);
  return res.data.data;
}
