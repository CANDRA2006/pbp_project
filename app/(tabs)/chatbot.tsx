import React, { useContext, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { ChatMessage, DUMMY_CHAT_MESSAGES } from '@/constants/dummyData';
import { LIGHT_COLORS, ThemeContext } from '../_layout';
import { translate } from '@/constants/translations';

export default function ChatbotScreen() {
  const { isDark, language } = useContext(ThemeContext);
  const colors = isDark ? COLORS : LIGHT_COLORS;
  const t = (key: string) => translate(language, key);
  const [messages, setMessages] = useState<ChatMessage[]>(DUMMY_CHAT_MESSAGES);
  const [input, setInput] = useState('');
  const list = useRef<FlatList<ChatMessage>>(null);
  const send = () => {
    const text = input.trim();
    if (!text) return;
    const id = `${Date.now()}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((current) => [...current, { id, role: 'user', text, time }, { id: `${id}-reply`, role: 'bot', text: 'Pertanyaan menarik. Mulailah dengan menguji konsep ini di lab lokal yang aman. Saya bisa bantu uraikan langkah belajar dan istilah yang terkait.', time }]);
    setInput('');
    requestAnimationFrame(() => list.current?.scrollToEnd({ animated: true }));
  };
  return <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={['top']}>
    <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}><View style={styles.botMark}><Feather name="cpu" size={19} color={COLORS.cyan} /></View><View style={styles.headerText}><Text style={[styles.heading, { color: colors.textPrimary }]}>CyberBot AI</Text><Text style={[styles.subheading, { color: colors.textMuted }]}>{t('online')}</Text></View><View style={[styles.online, { borderColor: isDark ? '#10B98144' : '#10B98177' }]}><View style={styles.onlineDot} /><Text style={styles.onlineText}>{t('onlineStatus')}</Text></View></View>
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 84 : 0}>
      <FlatList ref={list} data={messages} keyExtractor={(item) => item.id} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false} onContentSizeChange={() => list.current?.scrollToEnd({ animated: false })} renderItem={({ item }) => { const user = item.role === 'user'; return <View style={[styles.messageRow, user && styles.userRow]}>{!user && <View style={[styles.avatar, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><Feather name="cpu" size={13} color={COLORS.cyan} /></View>}<View style={[styles.messageWrap, user && styles.userWrap]}><View style={[styles.bubble, user ? styles.userBubble : [styles.botBubble, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]]}><Text style={[styles.messageText, !user && { color: colors.textPrimary }, user && styles.userText]}>{item.text}</Text></View><Text style={[styles.time, { color: colors.textMuted }, user && styles.userTime]}>{item.time}</Text></View></View>; }} />
      <View style={[styles.composer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}><TextInput style={[styles.input, { color: colors.textPrimary }]} value={input} onChangeText={setInput} placeholder={t('question')} placeholderTextColor={colors.placeholder} multiline maxLength={1200} onSubmitEditing={send} returnKeyType="send" /><TouchableOpacity style={[styles.send, !input.trim() && styles.sendDisabled]} onPress={send} activeOpacity={0.75} accessibilityLabel="Send message"><Feather name="arrow-up" size={19} color={COLORS.background} /></TouchableOpacity></View>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: COLORS.background }, flex: { flex: 1 }, header: { minHeight: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 17, gap: 11, borderBottomWidth: 1, borderBottomColor: COLORS.cardBorder }, botMark: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 13, backgroundColor: '#00E5FF14', borderWidth: 1, borderColor: '#00E5FF35' }, headerText: { flex: 1 }, heading: { color: COLORS.textPrimary, fontSize: 16, fontWeight: '700' }, subheading: { color: COLORS.textMuted, fontSize: 10, marginTop: 3 }, online: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: '#10B98144', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 6 }, onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.emerald }, onlineText: { color: COLORS.emerald, fontSize: 10, fontWeight: '600' }, chatContent: { paddingHorizontal: 15, paddingVertical: 18, gap: 15, flexGrow: 1, justifyContent: 'flex-end' }, messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 }, userRow: { justifyContent: 'flex-end' }, avatar: { width: 27, height: 27, borderRadius: 9, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.cardBorder, alignItems: 'center', justifyContent: 'center' }, messageWrap: { maxWidth: '82%' }, userWrap: { alignItems: 'flex-end' }, bubble: { borderRadius: 16, paddingHorizontal: 13, paddingVertical: 10 }, botBubble: { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.cardBorder, borderBottomLeftRadius: 5 }, userBubble: { backgroundColor: COLORS.cyan, borderBottomRightRadius: 5 }, messageText: { color: COLORS.textPrimary, fontSize: 13, lineHeight: 19 }, userText: { color: COLORS.background }, time: { color: COLORS.textMuted, fontSize: 9, marginTop: 4, marginHorizontal: 4 }, userTime: { textAlign: 'right' }, composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 9, marginHorizontal: 13, marginBottom: 10, padding: 7, borderRadius: 15, borderWidth: 1, borderColor: COLORS.cardBorder, backgroundColor: COLORS.surface }, input: { flex: 1, minHeight: 42, maxHeight: 110, color: COLORS.textPrimary, fontSize: 13, paddingHorizontal: 8, paddingVertical: 10 }, send: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.cyan }, sendDisabled: { opacity: 0.55 } });
