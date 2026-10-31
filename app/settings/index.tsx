import React, { useContext } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LIGHT_COLORS, ThemeContext } from '../_layout';
import { COLORS } from '@/constants/Colors';
import { translate } from '@/constants/translations';

const LANGUAGES = [{ id: 'ID', name: 'Bahasa Indonesia', detail: 'Indonesian' }, { id: 'EN', name: 'English', detail: 'English' }, { id: 'ZH', name: '\u4e2d\u6587', detail: 'Chinese' }];

export default function SettingsScreen() {
  const { isDark, setIsDark, language, setLanguage } = useContext(ThemeContext);
  const colors = isDark ? COLORS : LIGHT_COLORS;
  const t = (key: string) => translate(language, key);
  return <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
    <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}><TouchableOpacity style={styles.back} onPress={() => router.back()} accessibilityLabel={t('askBack')}><Feather name="arrow-left" size={19} color={colors.textPrimary} /></TouchableOpacity><Text style={[styles.title, { color: colors.textPrimary }]}>{t('settings')}</Text><View style={styles.back} /></View>
    <View style={styles.content}><Text style={[styles.intro, { color: colors.textSecondary }]}>{t('intro')}</Text>
      <Text style={[styles.section, { color: colors.textMuted }]}>{t('language')}</Text><View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>{LANGUAGES.map((item, index) => <TouchableOpacity key={item.id} style={[styles.option, index > 0 && styles.divider, index > 0 && { borderTopColor: colors.cardBorder }]} onPress={() => setLanguage(item.id as 'ID' | 'EN' | 'ZH')} activeOpacity={0.75} accessibilityRole="radio" accessibilityState={{ selected: language === item.id }}><View style={styles.languageCopy}><Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{item.name}</Text><Text style={[styles.optionDetail, { color: colors.textMuted }]}>{item.detail}</Text></View><View style={[styles.radio, { borderColor: language === item.id ? COLORS.cyan : colors.textMuted }, language === item.id && styles.radioSelected]}>{language === item.id && <View style={styles.radioDot} />}</View></TouchableOpacity>)}</View>
      <Text style={[styles.section, { color: colors.textMuted }]}>{t('appearance')}</Text><View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><View style={styles.option}><View style={styles.themeIcon}><Feather name={isDark ? 'moon' : 'sun'} size={17} color={COLORS.cyan} /></View><View style={styles.languageCopy}><Text style={[styles.optionTitle, { color: colors.textPrimary }]}>{isDark ? t('darkTheme') : t('lightTheme')}</Text><Text style={[styles.optionDetail, { color: colors.textMuted }]}>{t('themeHint')}</Text></View><Switch value={isDark} onValueChange={setIsDark} trackColor={{ false: '#AAB4BF', true: '#00E5FF70' }} thumbColor={isDark ? COLORS.cyan : '#F0F6FC'} accessibilityLabel={t('appearance')} /></View></View>
      <View style={styles.note}><Feather name="info" size={16} color={colors.textMuted} /><Text style={[styles.noteText, { color: colors.textMuted }]}>{t('saved')}</Text></View>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: COLORS.background }, header: { height: 58, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder }, back: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }, title: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' }, content: { padding: 18 }, intro: { color: COLORS.textSecondary, fontSize: 13, marginBottom: 25 }, section: { color: COLORS.textMuted, fontSize: 10, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9, marginTop: 5 }, card: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 14, overflow: 'hidden', marginBottom: 23 }, option: { minHeight: 65, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 11 }, divider: { borderTopWidth: 1, borderTopColor: COLORS.cardBorder }, languageCopy: { flex: 1 }, optionTitle: { color: COLORS.textPrimary, fontSize: 13, fontWeight: '600' }, optionDetail: { color: COLORS.textMuted, fontSize: 10, marginTop: 3 }, radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.textMuted, alignItems: 'center', justifyContent: 'center' }, radioSelected: { borderColor: COLORS.cyan }, radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: COLORS.cyan }, themeIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00E5FF12' }, note: { flexDirection: 'row', gap: 8, alignItems: 'center' }, noteText: { flex: 1, color: COLORS.textMuted, fontSize: 11, lineHeight: 16 } });
