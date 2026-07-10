// components/pdf/PRDTemplate.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { parseMarkdown } from '../utils/markdownParser';
import { BlockRenderer } from './BlockRenderer';

const ACCENT = '#1e3a8a';

const styles = StyleSheet.create({
  cover: {
    height: '100%',
    padding: 60,
    backgroundColor: ACCENT,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  coverEyebrow: { fontSize: 11, letterSpacing: 2, opacity: 0.7, marginBottom: 14, textTransform: 'uppercase' },
  coverTitle: { fontSize: 34, fontWeight: 700, marginBottom: 14, lineHeight: 1.2 },
  coverSubtitle: { fontSize: 13, opacity: 0.85, marginBottom: 6 },
  coverMeta: { position: 'absolute', bottom: 60, left: 60, fontSize: 10, opacity: 0.7 },
  page: { paddingTop: 50, paddingBottom: 50, paddingHorizontal: 55, fontFamily: 'Helvetica' },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 55,
    right: 55,
    fontSize: 9,
    color: '#9ca3af',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export type PRDTemplateProps = {
  title: string;
  companyName?: string;
  author?: string;
  content: string; // raw markdown from the AI
};

export function PRDTemplate({ title, companyName, author, content }: PRDTemplateProps) {
  const blocks = parseMarkdown(content);
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Document title={title} author={author ?? companyName ?? 'Generated PRD'}>
      {/* Cover page */}
      <Page size="A4" style={styles.cover}>
        <Text style={styles.coverEyebrow}>Product Requirements Document</Text>
        <Text style={styles.coverTitle}>{title}</Text>
        {companyName ? <Text style={styles.coverSubtitle}>{companyName}</Text> : null}
        <Text style={styles.coverMeta}>
          {dateStr}
          {author ? `  •  Prepared by ${author}` : ''}
        </Text>
      </Page>

      {/* Content pages */}
      <Page size="A4" style={styles.page} wrap>
        <BlockRenderer blocks={blocks} accentColor={ACCENT} />
        <View style={styles.footer} fixed>
          <Text>{title}</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
