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
