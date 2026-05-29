export type ApiUser = {
  id: number;
  email: string;
  fullName: string | null;
  username: string | null;
  avatarUrl: string | null;
  location: string | null;
  name: string;
  role: string;
};

export type AuthResponse = {
  accessToken: string;
  user: ApiUser;
};

export type PlaceListItem = {
  Id: string;
  Name: string;
  Located: string;
  Rate: number;
  NumberOfRate: number;
  Features: string;
  image: string;
};

export type PlaceReview = {
  ava: string;
  Name: string;
  Date: string;
  Content: string;
  Rate: number;
  Pictures: string[];
};

export type PlaceDetail = {
  Id: string;
  Name: string;
  Location: string;
  Rate: number;
  NumberOfRate: number;
  Image: string;
  Features: string;
  about?: string;
  priceLevel?: number | null;
  Reviews: PlaceReview[];
  isFavorite?: boolean;
};

export type ReviewListItem = {
  id: string;
  userId?: number | string;
  authorId?: number | string;
  UserId?: number | string;
  username: string;
  Rate: number;
  date: string;
  content: string;
  avatar: string;
  images: string[];
  likes: number;
};

export type ApiOk<T> = { ok: true; data: T; meta?: { total: number; limit: number; offset: number } };
export type ApiErr = { ok: false; error: string };
