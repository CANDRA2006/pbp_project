import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
type ThemeContextValue = { theme: ThemeMode; isReady: boolean; toggleTheme: (theme: ThemeMode) => void };
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void AsyncStorage.getItem('cyberhub.theme.selected').then(async (selected) => {
      // Old app versions wrote dark by default. Ignore that legacy value until
      // the user explicitly selects a theme, so the first upgraded launch is light.
      if (selected === 'true') {
        const saved = await AsyncStorage.getItem('cyberhub.theme');
        if (saved === 'dark' || saved === 'light') setTheme(saved);
      }
    }).catch(() => {}).finally(() => setIsReady(true));
  }, []);

  const toggleTheme = useCallback((next: ThemeMode) => {
    setTheme(next);
    void AsyncStorage.multiSet([['cyberhub.theme', next], ['cyberhub.theme.selected', 'true']]).catch((error) => console.warn('Unable to save theme preference:', error));
  }, []);
  const value = useMemo(() => ({ theme, isReady, toggleTheme }), [theme, isReady, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider.');
  return context;
}

export { ThemeContext };
