import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { theme, ThemeType } from '../common/theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextData {
  themeMode: ThemeMode;
  colors: ThemeType;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

const THEME_KEY = 'travel_app_theme_mode';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    (async () => {
      try {
        let savedTheme: string | null = null;
        if (Platform.OS === 'web') {
          savedTheme = window.localStorage.getItem(THEME_KEY);
        } else {
          savedTheme = await SecureStore.getItemAsync(THEME_KEY);
        }

        if (savedTheme === 'light' || savedTheme === 'dark') {
          setThemeMode(savedTheme);
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    })();
  }, []);

  const toggleTheme = async () => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
    try {
      if (Platform.OS === 'web') {
        window.localStorage.setItem(THEME_KEY, newMode);
      } else {
        await SecureStore.setItemAsync(THEME_KEY, newMode);
      }
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  const colors = theme[themeMode];

  return (
    <ThemeContext.Provider value={{ themeMode, colors, toggleTheme, isDark: themeMode === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
