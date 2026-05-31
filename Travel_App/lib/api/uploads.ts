import { API_V1 } from '../config';
import { getAccessToken } from './client';

export type UploadImageInput = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  isRemote?: boolean;
};

export async function uploadPlaceCover(uri: string): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  const name = uri.split('/').pop() || 'cover.jpg';
  form.append('file', {
    uri,
    name,
    type: 'image/jpeg',
  } as unknown as Blob);

  const res = await fetch(`${API_V1}/uploads/place-cover`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error || 'UPLOAD_FAILED');
  }
  return json.data.publicUrl as string;
}

export async function uploadReviewImage(uri: string): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  const name = uri.split('/').pop() || 'review.jpg';
  form.append('file', {
    uri,
    name,
    type: 'image/jpeg',
  } as unknown as Blob);

  const res = await fetch(`${API_V1}/uploads/review-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error || 'UPLOAD_FAILED');
  }
  return json.data.publicUrl as string;
}

export async function uploadReviewImages(images: UploadImageInput[]): Promise<string[]> {
  if (!images.length) {
    return [];
  }

  const remoteUrls = images
    .filter((item) => item.isRemote && /^https?:\/\//i.test(item.uri))
    .map((item) => item.uri);

  const localImages = images.filter((item) => !item.isRemote || !/^https?:\/\//i.test(item.uri));

  if (!localImages.length) {
    return remoteUrls;
  }

  const uploadedUrls = await Promise.all(localImages.map((item) => uploadReviewImage(item.uri)));
  return [...remoteUrls, ...uploadedUrls];
}

export async function uploadAvatar(uri: string): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  const name = uri.split('/').pop() || 'avatar.jpg';
  form.append('file', {
    uri,
    name,
    type: 'image/jpeg',
  } as unknown as Blob);

  const res = await fetch(`${API_V1}/uploads/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error || 'UPLOAD_FAILED');
  }
  return json.data.publicUrl as string;
}
