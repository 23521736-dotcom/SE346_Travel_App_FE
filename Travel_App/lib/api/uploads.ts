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

async function parseUploadResponse(res: Response, endpoint: string): Promise<string> {
  const text = await res.text();
  let json: any = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    if (!res.ok || text.trim().startsWith('<')) {
      throw new Error(`UPLOAD_ENDPOINT_NOT_FOUND: ${endpoint}`);
    }

    throw new Error('UPLOAD_INVALID_RESPONSE');
  }

  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || `UPLOAD_FAILED: ${endpoint}`);
  }

  const data = json.data;
  return data.items
    ? data.items.map((item: any) => item.publicUrl as string)
    : data.publicUrl as string;
}

async function uploadForm(endpoint: string, form: FormData, token: string | null): Promise<Response> {
  const url = `${API_V1}${endpoint}`;

  try {
    return await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: form,
    });
  } catch (err) {
    throw new Error(`Cannot connect to upload API at ${url}. Please check the backend server, port, Wi-Fi IP, and firewall.`);
  }
}

export async function uploadPlaceCover(uri: string): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  await appendImageFile(form, 'file', { uri }, 'cover.jpg');

  const endpoint = '/uploads/place-cover';
  const res = await uploadForm(endpoint, form, token);
  const uploadedUrl = await parseUploadResponse(res, endpoint);
  return Array.isArray(uploadedUrl) ? uploadedUrl[0] : uploadedUrl;
}

export async function uploadReviewImage(input: string | UploadImageInput): Promise<string> {
  const token = await getAccessToken();
  const form = new FormData();
  await appendImageFile(
    form,
    'file',
    typeof input === 'string' ? { uri: input } : input,
    'review.jpg'
  );

  const endpoint = '/uploads/review-image';
  const res = await uploadForm(endpoint, form, token);
  const uploadedUrl = await parseUploadResponse(res, endpoint);
  return Array.isArray(uploadedUrl) ? uploadedUrl[0] : uploadedUrl;
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

  const uploadedUrls = await Promise.all(localImages.map((item) => uploadReviewImage(item)));
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

  const endpoint = '/uploads/diary-image';
  const res = await uploadForm(endpoint, form, token);
  const uploadedUrl = await parseUploadResponse(res, endpoint);
  return Array.isArray(uploadedUrl) ? uploadedUrl[0] : uploadedUrl;
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

  const endpoint = '/uploads/avatar';
  const res = await uploadForm(endpoint, form, token);
  const uploadedUrl = await parseUploadResponse(res, endpoint);
  return Array.isArray(uploadedUrl) ? uploadedUrl[0] : uploadedUrl;
}
