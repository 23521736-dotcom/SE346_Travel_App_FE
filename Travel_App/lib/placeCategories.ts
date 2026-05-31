export const PLACE_CATEGORIES = [
  { value: 'ATTRACTIONS', label: 'Attractions' },
  { value: 'DINING', label: 'Dining' },
  { value: 'FESTIVALS', label: 'Festivals' },
  { value: 'STAYS', label: 'Stays' },
  { value: 'SHOPPING', label: 'Shopping' },
] as const;

export type PlaceCategory = (typeof PLACE_CATEGORIES)[number]['value'];

export const DEFAULT_PLACE_CATEGORY: PlaceCategory = 'ATTRACTIONS';

const PLACE_CATEGORY_VALUES = new Set<string>(PLACE_CATEGORIES.map((item) => item.value));

export function isPlaceCategory(category?: string | null): category is PlaceCategory {
  return !!category && PLACE_CATEGORY_VALUES.has(category);
}

export function normalizePlaceCategory(category?: string | null): PlaceCategory | undefined {
  const normalized = category?.trim().replace(/[\s-]+/g, '_').toUpperCase();
  if (!normalized) return undefined;

  if (isPlaceCategory(normalized)) {
    return normalized;
  }

  return undefined;
}

export function getPlaceCategoryLabel(category?: string | null): string {
  const value = normalizePlaceCategory(category) ?? DEFAULT_PLACE_CATEGORY;
  return PLACE_CATEGORIES.find((item) => item.value === value)?.label ?? value;
}
