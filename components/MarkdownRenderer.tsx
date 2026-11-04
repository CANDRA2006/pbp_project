import React from 'react';
import Markdown from 'react-native-markdown-display';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  body: { color: '#C9D1D9', fontSize: 15, lineHeight: 24 },
  heading1: { color: '#F0F6FC', fontWeight: '700', marginTop: 16, marginBottom: 8 },
  heading2: { color: '#F0F6FC', fontWeight: '700', marginTop: 14, marginBottom: 7 },
  heading3: { color: '#F0F6FC', fontWeight: '700', marginTop: 12, marginBottom: 6 },
  code_inline: { color: '#E6EDE2', backgroundColor: '#0D1117', fontFamily: 'SpaceMono' },
  code_block: { color: '#E6EDE2', backgroundColor: '#0D1117', borderColor: '#30363D', borderWidth: 1, borderRadius: 8, padding: 12, fontFamily: 'SpaceMono', fontSize: 13 },
  fence: { color: '#E6EDE2', backgroundColor: '#0D1117', borderColor: '#30363D', borderWidth: 1, borderRadius: 8, padding: 12, fontFamily: 'SpaceMono', fontSize: 13 },
  link: { color: '#58A6FF' },
  blockquote: { borderLeftColor: '#30363D', backgroundColor: '#0D1117', paddingHorizontal: 12 },
  bullet_list: { color: '#C9D1D9' }, ordered_list: { color: '#C9D1D9' },
});

export default function MarkdownRenderer({ content }: { content: string }) {
  return <Markdown style={styles}>{content}</Markdown>;
}
