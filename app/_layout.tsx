import { createContext, useEffect, useMemo, useState } from 'react';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider as NavigationThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { COLORS, LIGHT_COLORS } from '@/constants/Colors';
import i18n from '@/constants/i18n';
import 'react-native-reanimated';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = { anchor: '(tabs)' };

export { useTheme as useCyberTheme } from '@/context/ThemeContext';
export { LIGHT_COLORS };

export const ThemeContext = createContext({ isDark: true, language: 'ID' as 'ID' | 'EN' | 'ZH' });

void SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { session, isGuest, isLoading: authLoading } = useAuth();
  const { theme, isReady: themeReady } = useTheme();
  const segments = useSegments();
  const router = useRouter();
  const [language, setLanguage] = useState(i18n.language);
  useEffect(() => {
    const updateLanguage = (nextLanguage: string) => setLanguage(nextLanguage);
    i18n.on('languageChanged', updateLanguage);
    return () => { i18n.off('languageChanged', updateLanguage); };
  }, []);
  const isReady = !authLoading && themeReady;

  useEffect(() => {
    if (!isReady) return;
    const inAuth = segments[0] === '(auth)';
    const inTabs = segments[0] === '(tabs)';
    if (!session && !isGuest && inTabs) router.replace('/(auth)/login');
    else if (session && inAuth) router.replace('/(tabs)');
  }, [isReady, session, isGuest, segments, router]);

  const colors = theme === 'dark' ? COLORS : LIGHT_COLORS;
  const navigationTheme = {
    ...DarkTheme,
    dark: theme === 'dark',
    colors: { ...DarkTheme.colors, background: colors.background, card: colors.surface, text: colors.textPrimary, border: colors.cardBorder, primary: COLORS.cyan, notification: COLORS.emerald },
  };
  const legacyTheme = useMemo(() => ({ isDark: theme === 'dark', language: ({ id: 'ID', en: 'EN', zh: 'ZH' } as const)[language as 'id' | 'en' | 'zh'] ?? 'ID' }), [theme, language]);

  useEffect(() => {
    if (isReady) void SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) return <View style={{ flex: 1, backgroundColor: LIGHT_COLORS.background, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={COLORS.cyan} /></View>;

  return <ThemeContext.Provider value={legacyTheme}><NavigationThemeProvider value={navigationTheme}>
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth/callback" />
      <Stack.Screen name="settings/index" options={{ presentation: 'modal' }} />
    </Stack>
    <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
  </NavigationThemeProvider></ThemeContext.Provider>;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({ SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') });
  useEffect(() => { if (error) throw error; }, [error]);
  if (!loaded) return null;
  return <SafeAreaProvider><AuthProvider><ThemeProvider><AppNavigator /></ThemeProvider></AuthProvider></SafeAreaProvider>;
}
