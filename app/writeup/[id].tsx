import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { COLORS } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';

type Profile = { username: string | null; specialization: string[] | null } | null;
type Post = { id: string; title: string; category: string; content_markdown: string; created_at: string; user_id: string; profiles: Profile };

export default function WriteupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const loadPost = useCallback(async () => {
    if (!id) { setError('ID writeup tidak valid.'); setLoading(false); return; }
    const { data, error: queryError } = await supabase.from('posts').select('*, profiles(username, specialization)').eq('id', id).single();
    if (queryError) setError(queryError.message); else setPost(data as Post);
    setLoading(false);
  }, [id]);
  useEffect(() => { void Promise.resolve().then(() => loadPost()); }, [loadPost]);

  return <SafeAreaView style={styles.screen} edges={['top']}><View style={styles.header}><TouchableOpacity onPress={() => router.back()} style={styles.back} accessibilityLabel="Kembali"><Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} /></TouchableOpacity><Text style={styles.headerTitle}>Writeup</Text><View style={styles.back} /></View>
    {loading ? <View style={styles.center}><ActivityIndicator color={COLORS.cyan} /></View> : error || !post ? <View style={styles.center}><Ionicons name="alert-circle-outline" size={32} color={COLORS.textMuted} /><Text style={styles.error}>{error || 'Writeup tidak ditemukan.'}</Text></View> : <ScrollView contentContainerStyle={styles.content}><View style={styles.authorRow}><View style={styles.avatar}><Text style={styles.avatarText}>{(post.profiles?.username ?? 'C').slice(0, 1).toUpperCase()}</Text></View><View style={styles.author}><Text style={styles.username}>{post.profiles?.username ?? 'CyberHub member'}</Text><Text style={styles.date}>{new Date(post.created_at).toLocaleString()}</Text></View></View><View style={styles.badge}><Text style={styles.badgeText}>{post.category}</Text></View><Text style={styles.title}>{post.title}</Text><View style={styles.divider} /><MarkdownRenderer content={post.content_markdown} /></ScrollView>}
  </SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: COLORS.background }, header: { height: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder }, back: { width: 36, height: 36, justifyContent: 'center' }, headerTitle: { color: COLORS.textPrimary, fontSize: 17, fontWeight: '700' }, content: { padding: 20, paddingBottom: 50 }, authorRow: { flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 16 }, avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#202A35', borderWidth: 1, borderColor: COLORS.cardBorder, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: COLORS.cyan, fontSize: 16, fontWeight: '700' }, author: { flex: 1 }, username: { color: COLORS.textPrimary, fontSize: 14, fontWeight: '700' }, date: { color: COLORS.textMuted, fontSize: 11, marginTop: 4 }, badge: { alignSelf: 'flex-start', borderWidth: 1, borderColor: '#00E5FF66', backgroundColor: '#00E5FF12', borderRadius: 7, paddingHorizontal: 9, paddingVertical: 5, marginBottom: 12 }, badgeText: { color: COLORS.cyan, fontSize: 11, fontWeight: '700' }, title: { color: COLORS.textPrimary, fontSize: 24, lineHeight: 31, fontWeight: '800', marginBottom: 16 }, divider: { height: 1, backgroundColor: COLORS.cardBorder, marginBottom: 18 }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 24 }, error: { color: COLORS.textSecondary, fontSize: 14, textAlign: 'center' } });
