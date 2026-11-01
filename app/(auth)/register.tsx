import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS, LIGHT_COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { LanguagePicker } from '@/components/LanguagePicker';
import { useTheme } from '@/context/ThemeContext';

const SPECIALIZATIONS = ['WebSec', 'Forensics', 'Crypto', 'NetworkSec'] as const;
function getRegistrationErrorMessage(message: string, translate: (key: string) => string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('rate limit') || normalized.includes('too many requests')) {
    return translate('email_rate_limit');
  }
  return message || translate('error_register');
}

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? COLORS : LIGHT_COLORS;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState<(typeof SPECIALIZATIONS)[number]>('WebSec');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const passwordRules = [
    { key: 'password_rule_length', valid: password.length >= 8 },
    { key: 'password_rule_lowercase', valid: /[a-z]/.test(password) },
    { key: 'password_rule_uppercase', valid: /[A-Z]/.test(password) },
    { key: 'password_rule_number', valid: /\d/.test(password) },
    { key: 'password_rule_symbol', valid: /[^A-Za-z0-9\s]/.test(password) },
  ];

  const handleRegister = async () => {
    const name = username.trim();
    const normalizedEmail = email.trim().toLowerCase();
    if (name.length < 3) { setError(t('username_short')); return; }
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) { setError(t('email_invalid')); return; }
    if (!passwordRules.every((rule) => rule.valid)) { setError(t('password_strength_error')); return; }
    setError(''); setNotice(''); setBusy(true);
    try {
      const { data, error: signUpError } = await signUp(normalizedEmail, password, { username: name, specialization: [specialization] });
      if (signUpError) { setError(getRegistrationErrorMessage(signUpError.message, t)); return; }
      if (data.session) router.replace('/(tabs)');
      else setNotice(t('registration_check_email'));
    } catch (cause) {
      setError(getRegistrationErrorMessage(cause instanceof Error ? cause.message : '', t));
    } finally {
      setBusy(false);
    }
  };

  return <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}><KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.languageNav}><LanguagePicker /></View>
    <View style={styles.brand}><View style={styles.logo}><Feather name="shield" size={25} color={COLORS.cyan} /></View><Text style={[styles.brandName, { color: colors.textPrimary }]}>CyberHub</Text></View>
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><Text style={[styles.title, { color: colors.textPrimary }]}>{t('register_title')}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('username_placeholder')}</Text><View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}><Feather name="user" size={17} color={colors.textMuted} /><TextInput style={[styles.input, { color: colors.textPrimary }]} value={username} onChangeText={setUsername} placeholder={t('username_placeholder')} placeholderTextColor={colors.placeholder} autoCapitalize="none" autoComplete="username" textContentType="username" /></View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('email_placeholder')}</Text><View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}><Feather name="mail" size={17} color={colors.textMuted} /><TextInput style={[styles.input, { color: colors.textPrimary }]} value={email} onChangeText={setEmail} placeholder={t('email_placeholder')} placeholderTextColor={colors.placeholder} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" /></View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('password_placeholder')}</Text><View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}><Feather name="lock" size={17} color={colors.textMuted} /><TextInput style={[styles.input, { color: colors.textPrimary }]} value={password} onChangeText={(value) => { setPassword(value); setError(''); }} placeholder={t('password_placeholder')} placeholderTextColor={colors.placeholder} secureTextEntry autoComplete="new-password" textContentType="newPassword" /></View>
      <View style={styles.rules}>{passwordRules.map((rule) => <View key={rule.key} style={styles.rule}><Feather name={rule.valid ? 'check-circle' : 'circle'} size={13} color={rule.valid ? COLORS.emerald : colors.textMuted} /><Text style={[styles.ruleText, { color: rule.valid ? COLORS.emerald : colors.textMuted }]}>{t(rule.key)}</Text></View>)}</View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('select_specialization')}</Text><View style={styles.chips}>{SPECIALIZATIONS.map((item) => { const active = specialization === item; return <TouchableOpacity key={item} onPress={() => setSpecialization(item)} style={[styles.chip, { backgroundColor: colors.inputBackground, borderColor: colors.cardBorder }, active && styles.chipSelected]} accessibilityRole="radio" accessibilityState={{ selected: active }}><Text style={[styles.chipText, { color: colors.textSecondary }, active && styles.chipTextSelected]}>{item}</Text></TouchableOpacity>; })}</View>
      {!!error && <View style={styles.errorBox}><Feather name="alert-circle" size={16} color={COLORS.danger} /><Text style={styles.errorText}>{error}</Text></View>}
      {!!notice && <View style={styles.noticeBox}><Feather name="mail" size={16} color={COLORS.cyan} /><Text style={styles.noticeText}>{notice}</Text></View>}
      <TouchableOpacity style={[styles.button, busy && styles.disabled]} onPress={handleRegister} disabled={busy} activeOpacity={0.8}>{busy ? <ActivityIndicator color={COLORS.background} /> : <Text style={styles.buttonText}>{t('btn_register')}</Text>}</TouchableOpacity>
      <Link href={'/(auth)/login' as Href} asChild><TouchableOpacity style={styles.linkButton}><Text style={[styles.linkText, { color: colors.textSecondary }]}>{t('back_to_login')}</Text></TouchableOpacity></Link>
    </View>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', alignSelf: 'center', width: '100%', maxWidth: 520, padding: 24 }, languageNav: { zIndex: 5, alignItems: 'flex-start', marginBottom: 14 }, brand: { alignItems: 'center', marginBottom: 20 }, logo: { width: 48, height: 48, borderRadius: 15, borderWidth: 1, borderColor: '#00E5FF55', backgroundColor: '#00E5FF12', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }, brandName: { fontSize: 22, fontWeight: '800' }, card: { padding: 21, borderRadius: 16, borderWidth: 1 }, title: { fontSize: 20, fontWeight: '700', marginBottom: 8 }, label: { fontSize: 12, fontWeight: '600', marginTop: 12, marginBottom: 7 }, inputWrap: { minHeight: 47, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 10 }, input: { flex: 1, minWidth: 0, fontSize: 14, paddingVertical: 10 }, rules: { marginTop: 9, gap: 5 }, rule: { flexDirection: 'row', alignItems: 'center', gap: 7 }, ruleText: { fontSize: 11 }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8, borderWidth: 1 }, chipSelected: { borderColor: COLORS.cyan, backgroundColor: '#00E5FF18' }, chipText: { fontSize: 12, fontWeight: '600' }, chipTextSelected: { color: COLORS.cyan }, errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12 }, errorText: { color: COLORS.danger, flex: 1, fontSize: 12, lineHeight: 17 }, noticeBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12 }, noticeText: { color: COLORS.cyan, flex: 1, fontSize: 12, lineHeight: 17 }, button: { height: 48, marginTop: 20, borderRadius: 10, backgroundColor: COLORS.cyan, justifyContent: 'center', alignItems: 'center' }, disabled: { opacity: 0.65 }, buttonText: { color: COLORS.background, fontWeight: '700', fontSize: 14 }, linkButton: { alignItems: 'center', paddingTop: 17, paddingBottom: 3 }, linkText: { fontSize: 13, fontWeight: '600' } });
