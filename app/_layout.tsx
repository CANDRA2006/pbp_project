import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect, createContext, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '@/constants/Colors';
import 'react-native-reanimated';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

// ── Auth Context Placeholder ────────────────────────────────────────
export type AuthState = {
  isAuthenticated: boolean;
  user: { username: string; specialization: string } | null;
};

export const AuthContext = createContext<{
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
}>({
  auth: { isAuthenticated: false, user: null },
  setAuth: () => {},
});

// ── Theme Context Placeholder ───────────────────────────────────────
export const ThemeContext = createContext<{
  isDark: boolean;
  toggleTheme: () => void;
  setIsDark: (value: boolean) => void;
  language: 'ID' | 'EN' | 'ZH';
  setLanguage: (value: 'ID' | 'EN' | 'ZH') => void;
}>({
  isDark: true,
  toggleTheme: () => {},
  setIsDark: () => {},
  language: 'ID',
  setLanguage: () => {},
});

export const LIGHT_COLORS = { ...COLORS, background: '#F4F7FA', surface: '#FFFFFF', surfaceLight: '#E9EEF3', card: '#FFFFFF', cardBorder: '#D8E0E8', textPrimary: '#15202B', textSecondary: '#526171', textMuted: '#718096', tabBarBackground: 'rgba(255, 255, 255, 0.96)', tabBarBorder: '#D8E0E8', tabIconDefault: '#718096', inputBackground: '#F4F7FA', inputBorder: '#D8E0E8', placeholder: '#718096', overlay: 'rgba(15, 23, 42, 0.35)', terminalBg: '#17212B', terminalBorder: '#2A3948' } as const;

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// ── CyberHub Dark Theme ─────────────────────────────────────────────
const CyberHubDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.cardBorder,
    primary: COLORS.cyan,
    notification: COLORS.emerald,
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
  });

  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState<'ID' | 'EN' | 'ZH'>('ID');
  const [settingsReady, setSettingsReady] = useState(false);
  useEffect(() => {
    AsyncStorage.multiGet(['cyberhub.theme', 'cyberhub.language']).then(([theme, lang]) => {
      if (theme[1] === 'light') setIsDark(false);
      if (lang[1] === 'EN' || lang[1] === 'ZH' || lang[1] === 'ID') setLanguage(lang[1]);
    }).catch(() => {}).finally(() => setSettingsReady(true));
  }, []);
  const toggleTheme = () => setIsDark((prev) => !prev);

  const authValue = useMemo(() => ({ auth, setAuth }), [auth]);
  const themeValue = useMemo(() => ({ isDark, toggleTheme, setIsDark, language, setLanguage }), [isDark, language]);
  useEffect(() => { if (settingsReady) AsyncStorage.setItem('cyberhub.theme', isDark ? 'dark' : 'light').catch(() => {}); }, [isDark, settingsReady]);
  useEffect(() => { if (settingsReady) AsyncStorage.setItem('cyberhub.language', language).catch(() => {}); }, [language, settingsReady]);

  const appTheme = isDark ? CyberHubDarkTheme : { ...CyberHubDarkTheme, dark: false, colors: { ...CyberHubDarkTheme.colors, background: LIGHT_COLORS.background, card: LIGHT_COLORS.surface, text: LIGHT_COLORS.textPrimary, border: LIGHT_COLORS.cardBorder } };

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={authValue}>
        <ThemeContext.Provider value={themeValue}>
          <ThemeProvider value={appTheme}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="settings/index" options={{ presentation: 'modal', headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', headerShown: false }}
              />
            </Stack>
            <StatusBar style={isDark ? 'light' : 'dark'} />
          </ThemeProvider>
        </ThemeContext.Provider>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
