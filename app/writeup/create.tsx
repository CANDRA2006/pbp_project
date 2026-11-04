import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { COLORS } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['WebSec', 'Forensics', 'Crypto', 'OSINT', 'NetworkSec'];

export default function CreateWriteupScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState('');
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const [publishing, setPublishing] = useState(false);

  const publish = async () => {
    if (!user) { Alert.alert('Perlu masuk', 'Masuk ke akun untuk memublikasikan writeup.'); return; }
    if (!title.trim() || !content.trim()) { Alert.alert('Data belum lengkap', 'Isi judul dan konten writeup terlebih dahulu.'); return; }
    setPublishing(true);
    const { error } = await supabase.from('posts').insert({ title: title.trim(), category, content_markdown: content.trim(), user_id: user.id });
    setPublishing(false);
    if (error) { Alert.alert('Gagal memublikasikan', error.message); return; }
    Alert.alert('Writeup dipublikasikan', 'Writeup berhasil ditambahkan ke feed.', [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]);
  };

  return <SafeAreaView style={styles.screen} edges={['top']}><KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={styles.header}><TouchableOpacity onPress={() => router.back()} style={styles.back} accessibilityLabel="Kembali"><Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} /></TouchableOpacity><Text style={styles.headerTitle}>Buat Writeup</Text><View style={styles.back} /></View>
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Judul postingan</Text><TextInput value={title} onChangeText={setTitle} placeholder="Contoh: Analisis SQL Injection" placeholderTextColor={COLORS.placeholder} style={styles.titleInput} maxLength={140} />
      <Text style={styles.label}>Kategori</Text><View style={styles.categories}>{CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.chip, category === item && styles.selectedChip]}><Text style={[styles.chipText, category === item && styles.selectedChipText]}>{item}</Text></TouchableOpacity>)}</View>
      <View style={styles.editorHeader}><Text style={styles.label}>Konten Markdown</Text><View style={styles.toggle}>{(['write', 'preview'] as const).map((item) => <TouchableOpacity key={item} onPress={() => setMode(item)} style={[styles.toggleItem, mode === item && styles.toggleActive]}><Text style={[styles.toggleText, mode === item && styles.toggleTextActive]}>{item === 'write' ? 'Write' : 'Preview'}</Text></TouchableOpacity>)}</View></View>
      {mode === 'write' ? <TextInput value={content} onChangeText={setContent} placeholder={'Tulis writeup dengan Markdown...\n\nGunakan ``` untuk blok kode.'} placeholderTextColor={COLORS.placeholder} style={styles.editor} multiline textAlignVertical="top" /> : <View style={styles.preview}>{content.trim() ? <MarkdownRenderer content={content} /> : <Text style={styles.placeholder}>Pratinjau Markdown akan muncul di sini.</Text>}</View>}
      <TouchableOpacity onPress={() => void publish()} disabled={publishing} style={[styles.publish, publishing && styles.disabled]} activeOpacity={0.8}>{publishing ? <ActivityIndicator color={COLORS.background} /> : <><Ionicons name="send-outline" size={18} color={COLORS.background} /><Text style={styles.publishText}>Publikasikan Writeup</Text></>}</TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView></SafeAreaView>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, screen: { flex: 1, backgroundColor: COLORS.background }, header: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder }, back: { width: 36, height: 36, justifyContent: 'center' }, headerTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' }, content: { padding: 18, paddingBottom: 40 }, label: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700', marginBottom: 10 }, titleInput: { minHeight: 48, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 10, backgroundColor: COLORS.inputBackground, color: COLORS.textPrimary, paddingHorizontal: 13, fontSize: 14, marginBottom: 22 }, categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }, chip: { borderWidth: 1, borderColor: COLORS.inputBorder, backgroundColor: COLORS.surface, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 }, selectedChip: { borderColor: COLORS.cyan, backgroundColor: '#00E5FF18' }, chipText: { color: COLORS.textSecondary, fontSize: 12, fontWeight: '600' }, selectedChipText: { color: COLORS.cyan }, editorHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }, toggle: { flexDirection: 'row', borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 8, padding: 3, marginBottom: 8 }, toggleItem: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 }, toggleActive: { backgroundColor: '#00E5FF20' }, toggleText: { color: COLORS.textMuted, fontSize: 12, fontWeight: '600' }, toggleTextActive: { color: COLORS.cyan }, editor: { minHeight: 300, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 10, backgroundColor: COLORS.inputBackground, color: COLORS.textPrimary, padding: 14, fontSize: 14, lineHeight: 22, marginBottom: 22 }, preview: { minHeight: 300, borderWidth: 1, borderColor: COLORS.inputBorder, borderRadius: 10, backgroundColor: COLORS.surface, padding: 14, marginBottom: 22 }, placeholder: { color: COLORS.placeholder, fontSize: 14 }, publish: { minHeight: 50, borderRadius: 10, backgroundColor: COLORS.cyan, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center' }, disabled: { opacity: 0.65 }, publishText: { color: COLORS.background, fontSize: 14, fontWeight: '800' } });
