import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { COLORS, LIGHT_COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { LanguagePicker } from '@/components/LanguagePicker';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn, resendSignup, setGuestMode } = useAuth();
  const { theme } = useTheme();
  const colors = theme === 'dark' ? COLORS : LIGHT_COLORS;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLogin = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) { setError(t('email_invalid')); return; }
    if (!password) { setError(t('password_required')); return; }
    setError(''); setNotice(''); setCanResend(false); setBusy(true);
    try {
      const { error: authError } = await signIn(normalizedEmail, password);
      if (authError) {
        setError(authError.message || t('error_login'));
        setCanResend(authError.code === 'email_not_confirmed' || authError.message.toLowerCase().includes('email not confirmed'));
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('error_login'));
    } finally {
      setBusy(false);
    }
  };

  const resendVerification = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) { setError(t('email_invalid')); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { error: resendError } = await resendSignup(normalizedEmail);
      if (resendError) setError(resendError.message);
      else { setNotice(t('verification_sent')); setCanResend(false); }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t('error_login'));
    } finally {
      setBusy(false);
    }
  };

  const enterGuestMode = () => {
    setGuestMode(true);
    router.replace('/(tabs)' as Href);
  };

  return <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top', 'bottom']}><KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
    <View style={styles.languageNav}><LanguagePicker /></View>
    <View style={styles.brand}><View style={styles.logo}><Feather name="shield" size={27} color={COLORS.cyan} /></View><Text style={[styles.brandName, { color: colors.textPrimary }]}>CyberHub</Text><Text style={[styles.tagline, { color: colors.textSecondary }]}>{t('auth_subtitle')}</Text></View>
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><Text style={[styles.title, { color: colors.textPrimary }]}>{t('login_title')}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('email_placeholder')}</Text><View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}><Feather name="mail" size={17} color={colors.textMuted} /><TextInput style={[styles.input, { color: colors.textPrimary }]} value={email} onChangeText={setEmail} placeholder={t('email_placeholder')} placeholderTextColor={colors.placeholder} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="next" /></View>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{t('password_placeholder')}</Text><View style={[styles.inputWrap, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}><Feather name="lock" size={17} color={colors.textMuted} /><TextInput style={[styles.input, { color: colors.textPrimary }]} value={password} onChangeText={setPassword} placeholder={t('password_placeholder')} placeholderTextColor={colors.placeholder} secureTextEntry autoComplete="password" textContentType="password" onSubmitEditing={handleLogin} returnKeyType="go" /></View>
      {!!error && <View style={styles.errorBox}><Feather name="alert-circle" size={16} color={COLORS.danger} /><Text style={styles.errorText}>{error}</Text></View>}
      {!!notice && <View style={styles.noticeBox}><Feather name="mail" size={16} color={COLORS.cyan} /><Text style={styles.noticeText}>{notice}</Text></View>}
      {canResend && <TouchableOpacity onPress={() => void resendVerification()} disabled={busy} style={styles.resend}><Text style={styles.resendText}>{t('resend_verification')}</Text></TouchableOpacity>}
      <TouchableOpacity style={[styles.button, busy && styles.disabled]} onPress={handleLogin} disabled={busy} activeOpacity={0.8}>{busy ? <ActivityIndicator color={COLORS.background} /> : <><Text style={styles.buttonText}>{t('btn_login')}</Text><Feather name="arrow-right" size={17} color={COLORS.background} /></>}</TouchableOpacity>
      <Link href={'/(auth)/register' as Href} asChild><TouchableOpacity style={styles.linkButton}><Text style={[styles.linkText, { color: colors.textSecondary }]}>{t('no_account')}</Text></TouchableOpacity></Link>
      <TouchableOpacity onPress={enterGuestMode} disabled={busy} style={[styles.guestButton, { borderColor: colors.cardBorder }]} activeOpacity={0.75} accessibilityRole="button" accessibilityLabel="Masuk sebagai Tamu">
        <Feather name="compass" size={17} color={colors.textSecondary} />
        <Text style={[styles.guestText, { color: colors.textSecondary }]}>Masuk sebagai Tamu / Guest Mode</Text>
        <Feather name="arrow-right" size={16} color={colors.textMuted} />
      </TouchableOpacity>
    </View><Text style={[styles.footer, { color: colors.textMuted }]}>CYBERHUB  ·  LEARN WITH PURPOSE</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1 }, content: { flexGrow: 1, justifyContent: 'center', alignSelf: 'center', width: '100%', maxWidth: 520, padding: 24 }, languageNav: { alignItems: 'flex-start', marginBottom: 18, zIndex: 5 }, brand: { alignItems: 'center', marginBottom: 25 }, logo: { width: 56, height: 56, borderRadius: 17, borderWidth: 1, borderColor: '#00E5FF55', backgroundColor: '#00E5FF12', alignItems: 'center', justifyContent: 'center', marginBottom: 13 }, brandName: { fontSize: 25, fontWeight: '800', letterSpacing: 0.3 }, tagline: { fontSize: 13, marginTop: 5 }, card: { padding: 21, borderRadius: 16, borderWidth: 1 }, title: { fontSize: 20, fontWeight: '700', marginBottom: 14 }, label: { fontSize: 12, fontWeight: '600', marginTop: 12, marginBottom: 7 }, inputWrap: { minHeight: 48, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 10 }, input: { flex: 1, minWidth: 0, fontSize: 14, paddingVertical: 11 }, errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12 }, errorText: { color: COLORS.danger, flex: 1, fontSize: 12, lineHeight: 17 }, noticeBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 12 }, noticeText: { color: COLORS.cyan, flex: 1, fontSize: 12, lineHeight: 17 }, resend: { alignSelf: 'flex-start', paddingVertical: 11 }, resendText: { color: COLORS.cyanDark, fontSize: 12, fontWeight: '700' }, button: { height: 48, marginTop: 20, borderRadius: 10, backgroundColor: COLORS.cyan, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9 }, disabled: { opacity: 0.65 }, buttonText: { color: COLORS.background, fontWeight: '700', fontSize: 14 }, linkButton: { alignItems: 'center', paddingTop: 18, paddingBottom: 3 }, linkText: { fontSize: 13, fontWeight: '600' }, guestButton: { minHeight: 48, marginTop: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }, guestText: { flex: 1, fontSize: 13, fontWeight: '600' }, footer: { fontSize: 10, letterSpacing: 1.2, textAlign: 'center', marginTop: 23 } });
