import { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS, LIGHT_COLORS } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import i18n, { type AppLanguage } from '@/constants/i18n';

const LANGUAGES: { code: AppLanguage; labelKey: string; detail: string }[] = [
  { code: 'id', labelKey: 'lang_id', detail: 'ID' },
  { code: 'en', labelKey: 'lang_en', detail: 'EN' },
  { code: 'zh', labelKey: 'lang_zh', detail: '中文' },
];

export default function SettingsScreen() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const [language, setLanguage] = useState<AppLanguage>((i18n.language as AppLanguage) || 'id');
  const dark = theme === 'dark';
  const colors = dark ? COLORS : LIGHT_COLORS;

  const changeLanguage = async (code: AppLanguage) => {
    setLanguage(code);
    await i18n.changeLanguage(code);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) console.warn('Unable to sign out:', error.message);
  };

  return <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
    <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}><TouchableOpacity style={styles.back} onPress={() => router.back()} accessibilityLabel="Back"><Feather name="arrow-left" size={19} color={colors.textPrimary} /></TouchableOpacity><Text style={[styles.title, { color: colors.textPrimary }]}>{t('settings_title')}</Text><View style={styles.back} /></View>
    <View style={styles.content}>
      <Text style={[styles.section, { color: colors.textMuted }]}>{t('language').toUpperCase()}</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>{LANGUAGES.map((item, index) => <TouchableOpacity key={item.code} style={[styles.option, index > 0 && { borderTopWidth: 1, borderTopColor: colors.cardBorder }]} onPress={() => void changeLanguage(item.code)} accessibilityRole="radio" accessibilityState={{ selected: language === item.code }}><View style={styles.languageCopy}><Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{t(item.labelKey)}</Text><Text style={[styles.detail, { color: colors.textMuted }]}>{item.detail}</Text></View><View style={[styles.radio, { borderColor: language === item.code ? COLORS.cyan : colors.textMuted }]}>{language === item.code && <View style={styles.radioDot} />}</View></TouchableOpacity>)}</View>
      <Text style={[styles.section, { color: colors.textMuted }]}>{t('appearance').toUpperCase()}</Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><View style={styles.option}><View style={styles.themeIcon}><Feather name={dark ? 'moon' : 'sun'} size={17} color={COLORS.cyan} /></View><View style={styles.languageCopy}><Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{dark ? t('theme_dark') : t('theme_light')}</Text><Text style={[styles.detail, { color: colors.textMuted }]}>{t('save_preferences')}</Text></View><Switch value={dark} onValueChange={(value) => toggleTheme(value ? 'dark' : 'light')} trackColor={{ false: '#AAB4BF', true: '#00E5FF70' }} thumbColor={dark ? COLORS.cyan : '#F0F6FC'} accessibilityLabel={t('appearance')} /></View></View>
      <TouchableOpacity onPress={() => void handleSignOut()} style={[styles.logout, { borderColor: colors.cardBorder }]}><Feather name="log-out" size={17} color={COLORS.danger} /><Text style={styles.logoutText}>{t('logout')}</Text></TouchableOpacity>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1 }, header: { height: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1 }, back: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }, title: { fontSize: 16, fontWeight: '700' }, content: { padding: 18 }, section: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9, marginTop: 7 }, card: { borderWidth: 1, borderRadius: 14, overflow: 'hidden', marginBottom: 24 }, option: { minHeight: 65, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 11 }, languageCopy: { flex: 1 }, optionTitle: { fontSize: 13, fontWeight: '600' }, detail: { fontSize: 10, marginTop: 3 }, radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' }, radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.cyan }, themeIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00E5FF12' }, logout: { height: 48, borderWidth: 1, borderRadius: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, logoutText: { color: COLORS.danger, fontWeight: '700', fontSize: 13 } });
