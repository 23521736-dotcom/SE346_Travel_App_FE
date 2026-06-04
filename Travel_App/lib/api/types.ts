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

export type RegisterRole = "TRAVELER" | "OWNER";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: ApiUser;
};

export type ApiFavoritePlaceItem = {
  id?: string;
  name?: string;
  region?: string;
  latitude?: number | null;
  longitude?: number | null;
  lat?: number | null;
  lng?: number | null;
  Latitude?: number | null;
  Longitude?: number | null;
  Lat?: number | null;
  Lng?: number | null;
  point?: {
    lat?: number;
    lng?: number;
    lon?: number;
    latitude?: number;
    longitude?: number;
  };
  geoPoint?: {
    lat?: number;
    lng?: number;
    lon?: number;
    latitude?: number;
    longitude?: number;
  };
  geometry?: {
    coordinates?: number[];
    type?: string;
  };
  coordinates?: number[];
  coords?: number[];
  latlng?: number[];
  location?: {
    latitude?: number;
    longitude?: number;
    lat?: number;
    lng?: number;
    Latitude?: number;
    Longitude?: number;
    Lat?: number;
    Lng?: number;
    point?: {
      lat?: number;
      lng?: number;
      lon?: number;
      latitude?: number;
      longitude?: number;
    };
  };
  averageRating?: number;
  ratingCount?: number;
  featureLabel?: string;
  coverImageUrl?: string;
  images?: string[];
  priceLevel?: number | string | null;
  price?: number | string | null;
  cost?: number | string | null;
  estimatedCost?: number | string | null;
  Price?: number | string | null;
  Cost?: number | string | null;
  EstimatedCost?: number | string | null;
  Id?: string;
  Name?: string;
  Located?: string;
  Rate?: number;
  NumberOfRate?: number;
  Features?: string;
  image?: string;
  category?: string;
  Category?: string;
  PriceLevel?: number | string | null;
};

export type PlaceListItem = {
  id: string;
  name: string;
  region: string;
  latitude?: number | null;
  longitude?: number | null;
  averageRating: number;
  ratingCount: number;
  featureLabel: string;
  coverImageUrl: string;
  images: string[];
  Id: string;
  Name: string;
  Location: string;
  Located: string;
  Rate: number;
  NumberOfRate: number;
  Features: string;
  Image: string;
  image: string;
  Images?: string[];
  category?: string;
  Category?: string;
  priceLevel?: number | string | null;
  PriceLevel?: number | string | null;
  price?: number | string | null;
  Price?: number | string | null;
  cost?: number | string | null;
  Cost?: number | string | null;
  estimatedCost?: number | string | null;
  EstimatedCost?: number | string | null;
  Status?: 'PENDING' | 'APPROVED' | 'REJECTED';
  RejectionReason?: string | null;
  ReviewedAt?: string | null;
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
  latitude?: number | null;
  longitude?: number | null;
  id: string;
  name: string;
  region: string;
  averageRating: number;
  ratingCount: number;
  featureLabel: string;
  coverImageUrl: string;
  images: string[];
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

  category?: string;
  Category?: string;
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
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
  userAvatar?: string;
  userName?: string;
  imageUrls?: string[];
  likesCount?: number;
};

export type ApiOk<T> = { ok: true; data: T; meta?: { total: number; limit: number; offset: number } };
export type ApiErr = { ok: false; error: string };

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }
  return '';
};

const firstNumber = (...values: unknown[]): number => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return 0;
};

const firstFiniteNumber = (...values: unknown[]): number | undefined => {
  for (const value of values) {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }
  return undefined;
};

const readPointCoordinate = (
  point: any,
  keys: ('lat' | 'lng' | 'lon' | 'latitude' | 'longitude')[]
): number | undefined => {
  if (!point || typeof point !== 'object') {
    return undefined;
  }

  for (const key of keys) {
    const value = point[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
  }

  return undefined;
};

const normalizeExternalCoordinates = (raw: any): { latitude?: number; longitude?: number } => {
  const point = raw?.point ?? raw?.geoPoint ?? raw?.location?.point;
  const geometryCoordinates = raw?.geometry?.coordinates;
  const coordinates = raw?.coordinates;
  const latLng = raw?.latlng;
  const coordinatePair = Array.isArray(geometryCoordinates)
    ? geometryCoordinates
    : Array.isArray(coordinates)
      ? coordinates
      : Array.isArray(latLng)
        ? latLng
        : undefined;

  const latitude =
    firstFiniteNumber(
      raw.latitude,
      raw.lat,
      raw.Latitude,
      raw.Lat,
      raw.location?.latitude,
      raw.location?.lat,
      raw.location?.Latitude,
      raw.location?.Lat,
      readPointCoordinate(point, ['lat', 'latitude']),
      point?.coordinates?.[1],
      point?.coord?.[1]
    ) ??
    (Array.isArray(coordinatePair) ? coordinatePair[1] : undefined);

  const longitude =
    firstFiniteNumber(
      raw.longitude,
      raw.lng,
      raw.Lng,
      raw.Longitude,
      raw.location?.longitude,
      raw.location?.lng,
      raw.location?.Longitude,
      raw.location?.Lng,
      readPointCoordinate(point, ['lng', 'lon', 'longitude']),
      point?.coordinates?.[0],
      point?.coord?.[0]
    ) ??
    (Array.isArray(coordinatePair) ? coordinatePair[0] : undefined);

  return { latitude, longitude };
};

const normalizePlaceCoordinates = (raw: ApiFavoritePlaceItem): { latitude?: number; longitude?: number } => {
  const locationPoint = raw.location?.point;
  const latitude = firstFiniteNumber(
    raw.latitude,
    raw.lat,
    raw.Latitude,
    raw.Lat,
    raw.location?.latitude,
    raw.location?.lat,
    raw.location?.Latitude,
    raw.location?.Lat,
    locationPoint?.lat,
    locationPoint?.latitude
  );
  const longitude = firstFiniteNumber(
    raw.longitude,
    raw.lng,
    raw.Lng,
    raw.Longitude,
    raw.location?.longitude,
    raw.location?.lng,
    raw.location?.Longitude,
    raw.location?.Lng,
    locationPoint?.lng,
    locationPoint?.lon,
    locationPoint?.longitude
  );

  return { latitude, longitude };
};

const firstArray = <T>(...values: unknown[]): T[] => {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value as T[];
    }
  }
  return [];
};

export function normalizePlaceListItem(raw: ApiFavoritePlaceItem): PlaceListItem {
  const id = firstString(raw.id, raw.Id);
  const name = firstString(raw.name, raw.Name);
  const region = firstString(raw.region, raw.Located);
  const averageRating = firstNumber(raw.averageRating, raw.Rate);
  const ratingCount = firstNumber(raw.ratingCount, raw.NumberOfRate);
  const featureLabel = firstString(raw.featureLabel, raw.Features);
  const coverImageUrl = firstString(raw.coverImageUrl, raw.image);
  const images = firstArray<string>(raw.images);
  const category = firstString(raw.category, raw.Category);
  const priceLevel = raw.priceLevel ?? raw.PriceLevel ?? null;
  const { latitude, longitude } = normalizePlaceCoordinates(raw);
  const price =
    raw.price ??
    raw.Price ??
    raw.cost ??
    raw.Cost ??
    raw.estimatedCost ??
    raw.EstimatedCost ??
    priceLevel ??
    null;

  return {
    id,
    name,
    region,
    averageRating,
    ratingCount,
    featureLabel,
    coverImageUrl,
    images: images.length > 0 ? images : coverImageUrl ? [coverImageUrl] : [],
    Id: id,
    Name: name,
    Location: region,
    Located: region,
    Rate: averageRating,
    NumberOfRate: ratingCount,
    Features: featureLabel,
    Image: coverImageUrl,
    image: coverImageUrl,
    category,
    Category: category,
    latitude,
    longitude,
    priceLevel,
    PriceLevel: priceLevel,
    price,
    Price: price,
    cost: price,
    Cost: price,
  };
}

export function normalizePlaceDetail(raw: any): PlaceDetail {
  const place = normalizePlaceListItem(raw as ApiFavoritePlaceItem);
  const about = firstString(raw.about, raw.description);
  const location = firstString(raw.Location, raw.location, place.region);
  const placeImages = firstArray<string>(raw.images, raw.Images, raw.gallery);
  const reviews = firstArray<PlaceReview>(raw.Reviews, raw.reviews);
  const { latitude, longitude } = normalizeExternalCoordinates(raw);

  return {
    ...place,
    Id: place.id,
    Name: place.name,
    Location: location || place.region,
    Rate: place.averageRating,
    NumberOfRate: place.ratingCount,
    Image: firstString(raw.Image, raw.coverImageUrl, place.coverImageUrl),
    Features: place.featureLabel,
    about: about || undefined,
    priceLevel: typeof raw.priceLevel === 'number' ? raw.priceLevel : raw.priceLevel ?? null,
    Reviews: reviews,
    images: placeImages.length > 0 ? placeImages : place.images,
    latitude: latitude ?? place.latitude ?? null,
    longitude: longitude ?? place.longitude ?? null,
    isFavorite: Boolean(raw.isFavorite),
  };
}

export function normalizeReviewListItem(raw: any): ReviewListItem {
  const id = firstString(raw.id, raw.reviewId, raw.Id);
  const userId = raw.userId ?? raw.authorId ?? raw.UserId;
  const username = firstString(raw.username, raw.userName, raw.Name);
  const rating = firstNumber(raw.Rate, raw.rating);
  const date = firstString(raw.date, raw.createdAt, raw.updatedAt);
  const content = firstString(raw.content, raw.Content);
  const avatar = firstString(raw.avatar, raw.userAvatar, raw.ava);
  const images = firstArray<string>(raw.images, raw.imageUrls, raw.Pictures);
  const likes = firstNumber(raw.likes, raw.likesCount);

  return {
    id,
    userId,
    authorId: raw.authorId,
    UserId: raw.UserId,
    username,
    Rate: rating,
    date,
    content,
    avatar,
    images,
    likes,
    rating,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
    userAvatar: raw.userAvatar,
    userName: raw.userName,
    imageUrls: raw.imageUrls,
    likesCount: raw.likesCount,
  };
}
