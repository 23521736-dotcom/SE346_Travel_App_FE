import { lightTheme } from './theme';

// Export colors for backward compatibility
// Use lightTheme as default colors
export const colors = lightTheme;

// Re-export lightTheme for direct use in theme-aware components
export { lightTheme, darkTheme } from './theme';
export type { Theme } from './theme';
