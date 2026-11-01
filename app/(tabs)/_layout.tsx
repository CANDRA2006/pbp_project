import React from 'react';
import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, LIGHT_COLORS } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { translate } from '@/constants/translations';
import i18n from '@/constants/i18n';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ICONS = { index: 'home', roadmap: 'map', chatbot: 'cpu', profile: 'user' } as const;
const TITLE_KEYS = { index: 'home', roadmap: 'roadmap', chatbot: 'chatbot', profile: 'profile' } as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const language = ({ id: 'ID', en: 'EN', zh: 'ZH' } as const)[i18n.language as 'id' | 'en' | 'zh'];
  const colors = isDark ? COLORS : LIGHT_COLORS;
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: COLORS.cyan, tabBarInactiveTintColor: colors.tabIconDefault, tabBarStyle: { position: 'absolute', bottom: 0, height: 58 + insets.bottom, paddingTop: 7, paddingBottom: Math.max(insets.bottom, 8), backgroundColor: colors.tabBarBackground, borderTopColor: colors.tabBarBorder, borderTopWidth: 1, elevation: 0 }, tabBarBackground: () => isDark ? <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} /> : <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.tabBarBackground }]} />, tabBarLabelStyle: { fontSize: 11, fontWeight: '600' } }}>
    {(['index', 'roadmap', 'chatbot', 'profile'] as const).map((name) => <Tabs.Screen key={name} name={name} options={{ title: translate(language, TITLE_KEYS[name]), tabBarIcon: ({ focused, color }) => <Feather name={ICONS[name]} size={19} color={focused ? COLORS.cyan : String(color ?? colors.tabIconDefault)} /> }} />)}
  </Tabs>;
}
