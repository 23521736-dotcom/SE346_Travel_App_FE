import { API_V1 } from '../config';
import { getAccessToken } from './client';

export type UploadImageInput = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  isRemote?: boolean;
  file?: File;
};

function getFileName(uri: string, fallback: string, fileName?: string | null) {
  if (fileName?.trim()) {
    return fileName.trim();
  }

  const cleanUri = uri.split('?')[0] || uri;
  return cleanUri.split('/').pop() || fallback;
}

function isWebRuntime() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

async function appendImageFile(
  form: FormData,
  fieldName: string,
  input: UploadImageInput,
  fallbackName: string
) {
  const name = getFileName(input.uri, fallbackName, input.fileName);
  const mimeType = input.mimeType || 'image/jpeg';

  if (isWebRuntime()) {
    if (input.file) {
      form.append(fieldName, input.file);
      return;
    }

    const response = await fetch(input.uri);
    const blob = await response.blob();
    const file =
      typeof File !== 'undefined'
        ? new File([blob], name, { type: input.mimeType || blob.type || mimeType })
        : blob;
    form.append(fieldName, file);
    return;
  }

  form.append(fieldName, {
    uri: input.uri,
    name,
    type: mimeType,
  } as unknown as Blob);
}

export async function uploadPlaceCover(uri: string): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  await appendImageFile(form, 'file', { uri }, 'cover.jpg');

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
  await appendImageFile(form, 'file', { uri }, 'review.jpg');

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

export async function uploadDiaryImage(input: string | UploadImageInput): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  await appendImageFile(
    form,
    'file',
    typeof input === 'string' ? { uri: input } : input,
    'diary.jpg'
  );

  const res = await fetch(`${API_V1}/uploads/diary-image`, {
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

export async function uploadDiaryImages(images: UploadImageInput[]): Promise<string[]> {
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

  const uploadedUrls = await Promise.all(localImages.map((item) => uploadDiaryImage(item)));
  return [...remoteUrls, ...uploadedUrls];
}

export async function uploadAvatar(uri: string): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  await appendImageFile(form, 'file', { uri }, 'avatar.jpg');

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
