// components/pdf/BlockRenderer.tsx
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { Block, InlineRun } from '@utils/markdownParser';

// Renders a run of inline text (handling bold/italic) inside a single <Text> parent.
export function InlineText({ runs }: { runs: InlineRun[] }) {
  return (
    <>
      {runs.map((run, idx) => (
        <Text
          key={idx}
          style={{
            fontWeight: run.bold ? 700 : 400,
            fontStyle: run.italic ? 'italic' : 'normal',
          }}
        >
          {run.text}
        </Text>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: 700, marginTop: 18, marginBottom: 8 },
  h2: { fontSize: 15, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  h3: { fontSize: 12.5, fontWeight: 700, marginTop: 10, marginBottom: 4 },
  paragraph: { fontSize: 10.5, lineHeight: 1.6, marginBottom: 6 },
  bulletRow: { flexDirection: 'row', marginBottom: 4, paddingLeft: 4 },
  bulletDot: { width: 12, fontSize: 10.5 },
  bulletText: { flex: 1, fontSize: 10.5, lineHeight: 1.5 },
  numberedRow: { flexDirection: 'row', marginBottom: 4, paddingLeft: 4 },
  numberedIndex: { width: 20, fontSize: 10.5 },
  numberedText: { flex: 1, fontSize: 10.5, lineHeight: 1.5 },
  hr: { borderBottomWidth: 1, borderBottomColor: '#e5e7eb', marginVertical: 10 },
  space: { height: 6 },
  code: {
    fontSize: 9.5,
    fontFamily: 'Courier',
    backgroundColor: '#f3f4f6',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  table: { marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' },
  tableRow: { flexDirection: 'row' },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9.5,
    fontWeight: 700,
    backgroundColor: '#f3f4f6',
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    flex: 1,
    fontSize: 9.5,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
});

// accentColor lets each template (PRD / Pitch Deck) theme headings without duplicating logic.
export function BlockRenderer({ blocks, accentColor = '#1e3a8a' }: { blocks: Block[]; accentColor?: string }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h1':
            return (
              <Text key={i} style={[styles.h1, { color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4 }]}>
                <InlineText runs={block.runs} />
              </Text>
            );
          case 'h2':
            return (
              <Text key={i} style={[styles.h2, { color: accentColor }]}>
                <InlineText runs={block.runs} />
              </Text>
            );
          case 'h3':
            return (
              <Text key={i} style={styles.h3}>
                <InlineText runs={block.runs} />
              </Text>
            );
          case 'p':
            return (
              <Text key={i} style={styles.paragraph}>
                <InlineText runs={block.runs} />
              </Text>
            );
          case 'bullet':
            return (
              <View key={i} style={styles.bulletRow}>
                <Text style={[styles.bulletDot, { color: accentColor }]}>•</Text>
                <Text style={styles.bulletText}>
                  <InlineText runs={block.runs} />
                </Text>
              </View>
            );
          case 'numbered':
            return (
              <View key={i} style={styles.numberedRow}>
                <Text style={[styles.numberedIndex, { color: accentColor }]}>{block.index}.</Text>
                <Text style={styles.numberedText}>
                  <InlineText runs={block.runs} />
                </Text>
              </View>
            );
          case 'code':
            return (
              <Text key={i} style={styles.code}>
                {block.text}
              </Text>
            );
          case 'hr':
            return <View key={i} style={styles.hr} />;
          case 'space':
            return <View key={i} style={styles.space} />;
          case 'table':
            return (
              <View key={i} style={styles.table}>
                <View style={styles.tableRow}>
                  {block.headers.map((h, hi) => (
                    <Text key={hi} style={styles.tableHeaderCell}>
                      {h}
                    </Text>
                  ))}
                </View>
                {block.rows.map((row, ri) => (
                  <View key={ri} style={styles.tableRow}>
                    {row.map((cell, ci) => (
                      <Text key={ci} style={styles.tableCell}>
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
