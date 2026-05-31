export type PlaceCategory = 'Festivals' | 'Dining' | 'Attractions';

const FESTIVAL_KEYWORDS = [
  'festival',
  'festivals',
  'le hoi',
  'lễ hội',
  'event',
  'events',
  'celebration',
  'carnival',
  'fair',
];

const DINING_KEYWORDS = [
  'dining',
  'restaurant',
  'food',
  'cafe',
  'cafeteria',
  'ẩm thực',
  'am thuc',
  'an uong',
  'ăn uống',
  'eat',
  'drink',
  'bar',
];

const ATTRACTION_KEYWORDS = [
  'attraction',
  'attractions',
  'place',
  'landmark',
  'temple',
  'museum',
  'beach',
  'park',
  'nature',
  'tour',
  'tham quan',
  'sight',
  'destination',
  'scenic',
];

const CATEGORY_ORDER: PlaceCategory[] = ['Festivals', 'Dining', 'Attractions'];

function normalizeText(value?: string) {
  return (value || '').trim().toLowerCase();
}

function hasAnyKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function splitCategoryParts(value: string) {
  const parts = value.split(/[,;|/]+/g).map((item) => item.trim()).filter(Boolean);
  return parts.length ? parts : [value];
}

export function getPlaceCategories(value?: string): PlaceCategory[] {
  const normalized = normalizeText(value);
  if (!normalized) {
    return ['Attractions'];
  }

  const detected = new Set<PlaceCategory>();
  const parts = splitCategoryParts(normalized);

  parts.forEach((part) => {
    if (hasAnyKeyword(part, FESTIVAL_KEYWORDS)) {
      detected.add('Festivals');
    }

    if (hasAnyKeyword(part, DINING_KEYWORDS)) {
      detected.add('Dining');
    }

    if (hasAnyKeyword(part, ATTRACTION_KEYWORDS)) {
      detected.add('Attractions');
    }
  });

  return detected.size > 0 ? Array.from(detected) : ['Attractions'];
}

export function getPrimaryCategory(value?: string): PlaceCategory {
  const categories = getPlaceCategories(value);
  const ordered = CATEGORY_ORDER.find((item) => categories.includes(item));
  return ordered || 'Attractions';
}

export function matchesPlaceCategory(value: string | undefined, filter: string) {
  const normalizedFilter = normalizeText(filter);
  if (normalizedFilter === 'all' || normalizedFilter === 'all sights' || !normalizedFilter) {
    return true;
  }

  const categories = getPlaceCategories(value);

  if (normalizedFilter === 'festivals' || normalizedFilter === 'festival') {
    return categories.includes('Festivals');
  }

  if (normalizedFilter === 'dining') {
    return categories.includes('Dining');
  }

  if (normalizedFilter === 'attractions' || normalizedFilter === 'attraction') {
    return categories.includes('Attractions');
  }

  return false;
}