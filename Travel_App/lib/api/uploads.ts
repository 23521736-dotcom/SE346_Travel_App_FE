import { API_V1 } from '../config';
import { getAccessToken } from './client';

export type UploadImageInput = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  isRemote?: boolean;
};

function buildUploadHeaders(token: string | null): Record<string, string> {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

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
    headers: buildUploadHeaders(token),
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
    headers: buildUploadHeaders(token),
    body: form,
  });
  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error || 'UPLOAD_FAILED');
  }
  return json.data.publicUrl as string;
}

export async function uploadReviewImages(selectedImages: UploadImageInput[]): Promise<string[]> {
  const token = await getAccessToken();
  const form = new FormData();

  selectedImages.forEach((item, index) => {
    if (item.isRemote || /^https?:\/\//i.test(item.uri)) {
      return;
    }

    const name = item.fileName || item.uri.split('/').pop() || `review-${index + 1}.jpg`;
    const type = item.mimeType || 'image/jpeg';
    form.append('files', {
      uri: item.uri,
      name,
      type,
    } as unknown as Blob);
  });

  const hasLocalFiles = selectedImages.some((item) => !item.isRemote && !/^https?:\/\//i.test(item.uri));
  if (!hasLocalFiles) {
    return selectedImages.map((item) => item.uri);
  }

  const res = await fetch(`${API_V1}/uploads/review-images`, {
    method: 'POST',
    headers: buildUploadHeaders(token),
    body: form,
  });

  const json = await res.json();
  if (!res.ok || !json.ok) {
    throw new Error(json.error || 'UPLOAD_FAILED');
  }

  const uploaded = Array.isArray(json.data?.items)
    ? json.data.items.map((item: { publicUrl?: string }) => item.publicUrl).filter(Boolean)
    : [];

  const result: string[] = [];
  let uploadedIndex = 0;

  selectedImages.forEach((item) => {
    if (item.isRemote || /^https?:\/\//i.test(item.uri)) {
      result.push(item.uri);
      return;
    }

    result.push(uploaded[uploadedIndex] || item.uri);
    uploadedIndex += 1;
  });

  return result;
}
