import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { AuthContext } from '../_layout';

const SPECIALIZATIONS = ['WebSec', 'Forensics', 'Crypto', 'OSINT'];
export default function LoginScreen() {
  const { setAuth } = useContext(AuthContext);
  const { width } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const login = () => {
    if (!email.includes('@') || password.length < 6) { setError('Masukkan email valid dan kata sandi minimal 6 karakter.'); return; }
    setError(''); setAuth({ isAuthenticated: true, user: { username: email.split('@')[0] || 'member', specialization: selected[0] || 'WebSec' } }); router.replace('/(tabs)');
  };
  return <SafeAreaView style={styles.screen} edges={['top', 'bottom']}><KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView contentContainerStyle={[styles.content, { maxWidth: width >= 700 ? 480 : 520 }]} keyboardShouldPersistTaps="handled">
    <View style={styles.brand}><View style={styles.logo}><Ionicons name="shield-checkmark-outline" size={30} color={COLORS.cyan} /></View><Text style={styles.name}>CyberHub</Text><Text style={styles.tagline}>Ruang belajar dan berbagi keamanan siber.</Text></View>
    <View style={styles.form}><Text style={styles.heading}>Selamat datang</Text><Text style={styles.caption}>Masuk atau buat akun komunitas Anda.</Text>
      <Text style={styles.label}>Email</Text><View style={[styles.inputWrap, error && !email.includes('@') && styles.inputError]}><Ionicons name="mail-outline" size={18} color={COLORS.textMuted} /><TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="nama@contoh.com" placeholderTextColor={COLORS.placeholder} keyboardType="email-address" autoCapitalize="none" autoComplete="email" /></View>
      <Text style={styles.label}>Kata sandi</Text><View style={styles.inputWrap}><Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} /><TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Minimal 6 karakter" placeholderTextColor={COLORS.placeholder} secureTextEntry autoComplete="password" /></View>
      <Text style={styles.label}>Spesialisasi pilihan</Text><View style={styles.chips}>{SPECIALIZATIONS.map((spec) => { const active = selected.includes(spec); return <TouchableOpacity key={spec} onPress={() => setSelected((prev) => active ? prev.filter((item) => item !== spec) : [...prev, spec])} style={[styles.chip, active && styles.chipActive]} activeOpacity={0.75}><Text style={[styles.chipText, active && styles.chipTextActive]}>{spec}</Text></TouchableOpacity>; })}</View>
      {!!error && <View style={styles.errorRow}><Ionicons name="alert-circle-outline" size={16} color={COLORS.danger} /><Text style={styles.errorText}>{error}</Text></View>}
      <TouchableOpacity style={styles.submit} onPress={login} activeOpacity={0.82}><Text style={styles.submitText}>Masuk / Daftar</Text><Ionicons name="arrow-forward" size={18} color={COLORS.background} /></TouchableOpacity>
      <TouchableOpacity style={styles.guest} onPress={() => router.replace('/(tabs)')} activeOpacity={0.7}><Text style={styles.guestText}>Lanjutkan sebagai tamu</Text></TouchableOpacity>
    </View><Text style={styles.footer}>CyberHub · Komunitas keamanan siber</Text>
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: COLORS.background }, content: { flexGrow: 1, width: '100%', alignSelf: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 }, brand: { alignItems: 'center', marginBottom: 28 }, logo: { width: 58, height: 58, borderRadius: 18, borderWidth: 1, borderColor: '#00E5FF55', backgroundColor: '#00E5FF12', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }, name: { color: COLORS.textPrimary, fontSize: 26, fontWeight: '700', letterSpacing: 0.2 }, tagline: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 5 }, form: { backgroundColor: COLORS.surface, borderRadius: 16, borderWidth: 1, borderColor: COLORS.cardBorder, padding: 20 }, heading: { color: COLORS.textPrimary, fontSize: 20, fontWeight: '700' }, caption: { color: COLORS.textSecondary, fontSize: 13, marginTop: 5, marginBottom: 12 }, label: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600', marginTop: 14, marginBottom: 7 }, inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48, backgroundColor: COLORS.inputBackground, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 10, paddingHorizontal: 12 }, input: { flex: 1, minWidth: 0, color: COLORS.textPrimary, fontSize: 14, paddingVertical: 11 }, inputError: { borderColor: COLORS.danger }, chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, chip: { borderRadius: 8, paddingHorizontal: 11, paddingVertical: 8, backgroundColor: COLORS.inputBackground, borderWidth: 1, borderColor: COLORS.cardBorder }, chipActive: { backgroundColor: '#00E5FF18', borderColor: COLORS.cyan }, chipText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' }, chipTextActive: { color: COLORS.cyan }, errorRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 12 }, errorText: { flex: 1, color: COLORS.danger, fontSize: 12, lineHeight: 17 }, submit: { height: 48, marginTop: 20, borderRadius: 10, backgroundColor: COLORS.cyan, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 }, submitText: { color: COLORS.background, fontSize: 14, fontWeight: '700' }, guest: { alignItems: 'center', paddingVertical: 14 }, guestText: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600' }, footer: { color: COLORS.textMuted, fontSize: 11, textAlign: 'center', marginTop: 20 } });
