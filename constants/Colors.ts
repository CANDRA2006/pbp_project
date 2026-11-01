/**
 * CyberHub Color Constants
 * Dark-first cybersecurity theme with Cyan & Emerald accents
 */

export const COLORS = {
  // Base backgrounds
  background: '#0B0F17',
  surface: '#161B22',
  surfaceLight: '#21262D',
  card: '#161B22',
  cardBorder: '#21262D',

  // Accent colors
  cyan: '#00E5FF',
  cyanDark: '#00B8CC',
  emerald: '#10B981',
  emeraldDark: '#059669',

  // Text
  textPrimary: '#F0F6FC',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',

  // Status
  upvote: '#06B6D4',
  danger: '#EF4444',
  warning: '#F59E0B',

  // Tab bar
  tabBarBackground: 'rgba(11, 15, 23, 0.92)',
  tabBarBorder: '#21262D',
  tabIconDefault: '#6E7681',
  tabIconActive: '#00E5FF',

  // Misc
  inputBackground: '#0D1117',
  inputBorder: '#30363D',
  placeholder: '#6E7681',
  overlay: 'rgba(0, 0, 0, 0.5)',
  terminalBg: '#0D1117',
  terminalBorder: '#21262D',
} as const;

export const LIGHT_COLORS = { ...COLORS, background: '#F4F7FA', surface: '#FFFFFF', surfaceLight: '#E9EEF3', card: '#FFFFFF', cardBorder: '#D8E0E8', textPrimary: '#15202B', textSecondary: '#526171', textMuted: '#718096', tabBarBackground: 'rgba(255, 255, 255, 0.96)', tabBarBorder: '#D8E0E8', tabIconDefault: '#718096', inputBackground: '#F4F7FA', inputBorder: '#D8E0E8', placeholder: '#718096', overlay: 'rgba(15, 23, 42, 0.35)', terminalBg: '#17212B', terminalBorder: '#D8E0E8' } as const;

// Legacy compat for expo-router ThemeProvider
const tintColorDark = COLORS.cyan;

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#2f95dc',
    tabIconDefault: '#ccc',
    tabIconSelected: '#2f95dc',
  },
  dark: {
    text: COLORS.textPrimary,
    background: COLORS.background,
    tint: tintColorDark,
    tabIconDefault: COLORS.tabIconDefault,
    tabIconSelected: tintColorDark,
  },
} as { [key: string]: { text: string; background: string; tint: string; tabIconDefault: string; tabIconSelected: string } };
