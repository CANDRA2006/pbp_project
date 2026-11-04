import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { COLORS, LIGHT_COLORS } from '@/constants/Colors';
import { ThemeContext } from '../_layout';
import { translate } from '@/constants/translations';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['All', 'WebSec', 'Forensics', 'Crypto', 'OSINT', 'NetworkSec'];
type Profile = { username: string | null; specialization: string[] | null } | null;
type Post = { id: string; title: string; category: string; content_markdown: string; created_at: string; user_id: string; profiles: Profile };

export default function HomeScreen() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const { isDark, language } = useContext(ThemeContext);
  const colors = isDark ? COLORS : LIGHT_COLORS;
  const insets = useSafeAreaInsets();
  const t = (key: string) => translate(language, key);

  const loadPosts = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError('');
    let query = supabase.from('posts').select('*, profiles(username, specialization)').order('created_at', { ascending: false });
    if (category !== 'All') query = query.eq('category', category);
    const { data, error: queryError } = await query;
    if (queryError) setError(queryError.message);
    else setPosts((data ?? []) as Post[]);
    setLoading(false);
    setRefreshing(false);
  }, [category]);

  useEffect(() => { void Promise.resolve().then(() => loadPosts()); }, [loadPosts]);
  const filteredPosts = posts.filter((post) => `${post.title} ${post.profiles?.username ?? ''} ${post.content_markdown}`.toLowerCase().includes(search.toLowerCase()));

  return <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
    <View style={styles.topbar}><View style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><Ionicons name="search-outline" size={19} color={colors.textMuted} /><TextInput value={search} onChangeText={setSearch} placeholder={t('search')} placeholderTextColor={colors.placeholder} style={[styles.searchInput, { color: colors.textPrimary }]} returnKeyType="search" /></View></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>{CATEGORIES.map((item) => <TouchableOpacity key={item} onPress={() => setCategory(item)} style={[styles.pill, { backgroundColor: colors.surface, borderColor: colors.cardBorder }, category === item && styles.activePill]}><Text style={[styles.pillText, { color: colors.textSecondary }, category === item && styles.activeText]}>{item === 'All' ? t('all') : item}</Text></TouchableOpacity>)}</ScrollView>
    {loading ? <View style={styles.center}><ActivityIndicator color={COLORS.cyan} /></View> : error ? <View style={styles.center}><Text style={[styles.message, { color: colors.textSecondary }]}>{error}</Text><TouchableOpacity onPress={() => void loadPosts()}><Text style={styles.retry}>Coba lagi</Text></TouchableOpacity></View> : <FlatList data={filteredPosts} keyExtractor={(item) => item.id} contentContainerStyle={styles.feed} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadPosts(true)} tintColor={COLORS.cyan} colors={[COLORS.cyan]} />} renderItem={({ item }) => <TouchableOpacity activeOpacity={0.78} onPress={() => router.push(`/writeup/${item.id}` as Href)} style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><View style={styles.cardHeader}><View style={styles.avatar}><Text style={styles.avatarText}>{(item.profiles?.username ?? 'C').slice(0, 1).toUpperCase()}</Text></View><View style={styles.author}><Text style={[styles.username, { color: colors.textPrimary }]}>{item.profiles?.username ?? 'CyberHub member'}</Text><Text style={[styles.date, { color: colors.textMuted }]}>{new Date(item.created_at).toLocaleDateString()}</Text></View><View style={styles.badge}><Text style={styles.badgeText}>{item.category}</Text></View></View><Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>{item.title}</Text><Text style={[styles.excerpt, { color: colors.textSecondary }]} numberOfLines={3}>{item.content_markdown}</Text><Text style={styles.readMore}>Baca writeup <Ionicons name="arrow-forward" size={13} /></Text></TouchableOpacity>} ListEmptyComponent={<View style={styles.center}><Ionicons name="file-tray-outline" size={30} color={colors.textMuted} /><Text style={[styles.message, { color: colors.textMuted }]}>{error || t('noResults')}</Text></View>} />}
    <TouchableOpacity style={[styles.fab, { bottom: 74 + insets.bottom }]} activeOpacity={0.8} accessibilityLabel={t('createWriteup')} onPress={() => router.push('/writeup/create' as Href)}><Ionicons name="add" size={27} color={COLORS.background} /></TouchableOpacity>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1 }, topbar: { paddingHorizontal: 16, paddingVertical: 12 }, search: { height: 46, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1 }, searchInput: { flex: 1, fontSize: 14 }, categories: { gap: 8, paddingHorizontal: 16, paddingBottom: 10 }, pill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9, borderWidth: 1 }, activePill: { borderColor: COLORS.cyan, backgroundColor: '#00E5FF18' }, pillText: { fontWeight: '600', fontSize: 13 }, activeText: { color: COLORS.cyan }, feed: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 120, flexGrow: 1 }, card: { borderWidth: 1, borderRadius: 14, padding: 16, marginBottom: 12 }, cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 13 }, avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#202A35', borderWidth: 1, borderColor: COLORS.cardBorder, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: COLORS.cyan, fontWeight: '700' }, author: { flex: 1 }, username: { fontWeight: '700', fontSize: 13 }, date: { fontSize: 11, marginTop: 3 }, badge: { borderWidth: 1, borderColor: '#00E5FF66', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7 }, badgeText: { color: COLORS.cyan, fontSize: 10, fontWeight: '700' }, title: { fontSize: 16, fontWeight: '700', marginBottom: 6 }, excerpt: { fontSize: 13, lineHeight: 19 }, readMore: { color: '#58A6FF', fontSize: 12, fontWeight: '600', marginTop: 12 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }, message: { fontSize: 14, textAlign: 'center' }, retry: { color: COLORS.cyan, fontWeight: '700' }, fab: { position: 'absolute', right: 20, width: 52, height: 52, borderRadius: 16, backgroundColor: COLORS.cyan, alignItems: 'center', justifyContent: 'center', elevation: 7 } });
