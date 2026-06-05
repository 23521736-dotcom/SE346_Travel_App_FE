import AsyncStorage from '@react-native-async-storage/async-storage';

export type PricePreferenceKey = 'budget' | 'moderate';

export type PricePreferences = Record<PricePreferenceKey, number>;

const PRICE_PREFERENCES_STORAGE_KEY = '@travel_app_price_preferences';

export const DEFAULT_PRICE_PREFERENCES: PricePreferences = {
  budget: 150000,
  moderate: 500000,
};

const toPositiveNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  return null;
};

export const getPriceInputValue = (value: unknown): string => {
  return String(value ?? '').replace(/[^0-9]/g, '');
};

export const normalizePricePreferences = (value: Partial<PricePreferences>): PricePreferences => {
  const budget = toPositiveNumber(value.budget) ?? DEFAULT_PRICE_PREFERENCES.budget;
  const moderate = toPositiveNumber(value.moderate) ?? DEFAULT_PRICE_PREFERENCES.moderate;

  return {
    budget,
    moderate: Math.max(moderate, budget),
  };
};

export async function loadPricePreferences(): Promise<PricePreferences> {
  try {
    const raw = await AsyncStorage.getItem(PRICE_PREFERENCES_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PRICE_PREFERENCES;
    }

    const parsed = JSON.parse(raw) as Partial<PricePreferences>;
    return normalizePricePreferences(parsed);
  } catch (error) {
    console.warn('Failed to load price preferences:', error);
    return DEFAULT_PRICE_PREFERENCES;
  }
}

export async function savePricePreferences(value: Partial<PricePreferences>): Promise<PricePreferences> {
  const normalized = normalizePricePreferences(value);
  await AsyncStorage.setItem(PRICE_PREFERENCES_STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export const formatVndCompact = (value: number): string => {
  if (value >= 1000000) {
    const millions = value / 1000000;
    return `${Number.isInteger(millions) ? millions : millions.toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }

  return String(value);
};
