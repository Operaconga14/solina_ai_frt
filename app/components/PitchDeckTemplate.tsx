// components/pdf/PitchDeckTemplate.tsx
//
// Unlike the PRD (a flowing document), a pitch deck reads as discrete slides.
// We split the parsed blocks into "sections" wherever an h1 or h2 appears,
// and render each section as its own landscape A4 page.

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Block, parseMarkdown } from '../utils/markdownParser';
import { BlockRenderer } from './BlockRenderer';

const ACCENT = '#7c3aed'; // distinct theme color from the PRD (indigo/violet, "pitch energy")
const DARK = '#111827';

const styles = StyleSheet.create({
  cover: {
    height: '100%',
    padding: 70,
    backgroundColor: DARK,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  coverEyebrow: { fontSize: 12, letterSpacing: 3, color: ACCENT, marginBottom: 16, textTransform: 'uppercase' },
  coverTitle: { fontSize: 40, fontWeight: 700, marginBottom: 16, lineHeight: 1.15 },
  coverSubtitle: { fontSize: 14, opacity: 0.75 },
  coverMeta: { position: 'absolute', bottom: 50, left: 70, fontSize: 10, opacity: 0.55 },

  slide: {
    padding: 55,
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  slideNumber: {
    position: 'absolute',
    bottom: 24,
    right: 40,
    fontSize: 9,
    color: '#9ca3af',
  },
  slideAccentBar: {
    height: 4,
    width: 60,
    backgroundColor: ACCENT,
    marginBottom: 18,
  },
});

// Groups a flat block list into sections, splitting before each h1/h2 heading.
function splitIntoSections(blocks: Block[]): Block[][] {
  const sections: Block[][] = [];
  let current: Block[] = [];

  for (const block of blocks) {
    if ((block.type === 'h1' || block.type === 'h2') && current.length > 0) {
      sections.push(current);
      current = [];
    }
    current.push(block);
  }
  if (current.length > 0) sections.push(current);
  return sections;
}

export type PitchDeckTemplateProps = {
  title: string;
  tagline?: string;
  companyName?: string;
  content: string; // raw markdown from the AI, sections separated by # / ## headings
};

export function PitchDeckTemplate({ title, tagline, companyName, content }: PitchDeckTemplateProps) {
  const blocks = parseMarkdown(content);
  const sections = splitIntoSections(blocks);
  const dateStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

  return (
    <Document title={title} author={companyName ?? 'Generated Pitch Deck'}>
      {/* Cover slide */}
      <Page size="A4" orientation="landscape" style={styles.cover}>
        <Text style={styles.coverEyebrow}>Pitch Deck</Text>
        <Text style={styles.coverTitle}>{title}</Text>
        {tagline ? <Text style={styles.coverSubtitle}>{tagline}</Text> : null}
        <Text style={styles.coverMeta}>
          {companyName ? `${companyName}  •  ` : ''}
          {dateStr}
        </Text>
      </Page>

      {/* One slide per section */}
      {sections.map((sectionBlocks, i) => (
        <Page key={i} size="A4" orientation="landscape" style={styles.slide} wrap>
          <View style={styles.slideAccentBar} />
          <BlockRenderer blocks={sectionBlocks} accentColor={ACCENT} />
          <Text style={styles.slideNumber} render={() => `${i + 2}`} fixed />
        </Page>
      ))}
    </Document>
  );
}
