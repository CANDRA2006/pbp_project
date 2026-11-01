import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS, LIGHT_COLORS } from '@/constants/Colors';
import { useTheme } from '@/context/ThemeContext';
import i18n, { type AppLanguage } from '@/constants/i18n';

const options: { code: AppLanguage; label: string }[] = [
  { code: 'id', label: 'Bahasa Indonesia' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

export function LanguagePicker() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const colors = theme === 'dark' ? COLORS : LIGHT_COLORS;
  const language = (options.some((item) => item.code === i18n.language) ? i18n.language : 'id') as AppLanguage;

  useEffect(() => {
    void AsyncStorage.getItem('cyberhub.language.selected').then((selected) => {
      if (!selected) setOpen(true);
    }).catch(() => {});
  }, []);

  return <View style={styles.wrap}>
    <TouchableOpacity style={[styles.trigger, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]} onPress={() => setOpen((value) => !value)} accessibilityRole="button" accessibilityLabel={t('language')} accessibilityState={{ expanded: open }}>
      <Feather name="globe" size={14} color={COLORS.cyan} />
      <Text style={[styles.code, { color: colors.textPrimary }]}>{language.toUpperCase()}</Text>
      <Feather name={open ? 'chevron-up' : 'chevron-down'} size={13} color={colors.textSecondary} />
    </TouchableOpacity>
    {open && <View style={[styles.menu, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
      {options.map((option) => <TouchableOpacity key={option.code} style={styles.option} onPress={() => { void i18n.changeLanguage(option.code); void AsyncStorage.setItem('cyberhub.language.selected', 'true').catch(() => {}); setOpen(false); }} accessibilityRole="radio" accessibilityState={{ selected: language === option.code }}>
        <Text style={[styles.label, { color: language === option.code ? COLORS.cyan : colors.textPrimary }]}>{option.label}</Text>
        {language === option.code && <Feather name="check" size={14} color={COLORS.cyan} />}
      </TouchableOpacity>)}
    </View>}
  </View>;
}

const styles = StyleSheet.create({ wrap: { alignSelf: 'flex-start', zIndex: 10 }, trigger: { minHeight: 36, flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 10, borderWidth: 1, borderRadius: 10 }, code: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 }, menu: { position: 'absolute', top: 42, left: 0, width: 190, borderWidth: 1, borderRadius: 12, paddingVertical: 5, elevation: 8, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: 5 } }, option: { minHeight: 40, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { fontSize: 12, fontWeight: '600' } });
