// lib/pdf/markdownParser.ts
//
// Lightweight markdown -> block parser built specifically for @react-pdf/renderer.
// @react-pdf/renderer cannot render raw HTML, so we can't just use `marked` + dangerouslySetInnerHTML.
// Instead we parse markdown into a flat list of typed blocks, and each block's inline
// text is further split into "runs" (normal / bold / italic) so templates can render
// mixed-formatting text with multiple <Text> spans.

export type InlineRun = {
  text: string;
  bold?: boolean;
  italic?: boolean;
};

export type Block =
  | { type: 'h1'; runs: InlineRun[] }
  | { type: 'h2'; runs: InlineRun[] }
  | { type: 'h3'; runs: InlineRun[] }
  | { type: 'p'; runs: InlineRun[] }
  | { type: 'bullet'; runs: InlineRun[] }
  | { type: 'numbered'; index: number; runs: InlineRun[] }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'code'; text: string }
  | { type: 'hr' }
  | { type: 'space' };

// Splits a line of text into runs, handling **bold** and *italic*/_italic_.
export function parseInline(text: string): InlineRun[] {
  const runs: InlineRun[] = [];
  // Matches **bold**, *italic*, _italic_ in order of appearance
  const pattern = /(\*\*.+?\*\*|\*.+?\*|_.+?_)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      runs.push({ text: text.slice(lastIndex, match.index) });
    }
    const token = match[0];
    if (token.startsWith('**')) {
      runs.push({ text: token.slice(2, -2), bold: true });
    } else if (token.startsWith('*') || token.startsWith('_')) {
      runs.push({ text: token.slice(1, -1), italic: true });
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    runs.push({ text: text.slice(lastIndex) });
  }
  return runs.length > 0 ? runs : [{ text }];
}

function isTableSeparatorRow(line: string): boolean {
  // e.g. "| --- | --- | --- |" or "|---|---|---|"
  return /^\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?$/.test(line.trim());
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

export function parseMarkdown(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];

  let i = 0;
  let numberedIndex = 1;
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  while (i < lines.length) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Fenced code blocks (```...```)
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBuffer = [];
      } else {
        inCodeBlock = false;
        blocks.push({ type: 'code', text: codeBuffer.join('\n') });
      }
      i++;
      continue;
    }
    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      i++;
      continue;
    }

    // Blank line -> spacer, reset numbered list counter
    if (line === '') {
      blocks.push({ type: 'space' });
      numberedIndex = 1;
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Tables: a line containing "|" followed by a separator row
    if (line.includes('|') && i + 1 < lines.length && isTableSeparatorRow(lines[i + 1])) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      i += 2; // skip header + separator
      while (i < lines.length && lines[i].trim().includes('|')) {
        rows.push(splitTableRow(lines[i]));
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', runs: parseInline(line.slice(4)) });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', runs: parseInline(line.slice(3)) });
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push({ type: 'h1', runs: parseInline(line.slice(2)) });
      i++;
      continue;
    }

    // Bullet list
    if (/^[-*]\s+/.test(line)) {
      blocks.push({ type: 'bullet', runs: parseInline(line.replace(/^[-*]\s+/, '')) });
      i++;
      continue;
    }

    // Numbered list
    const numberedMatch = line.match(/^(\d+)[.)]\s+(.*)$/);
    if (numberedMatch) {
      blocks.push({ type: 'numbered', index: numberedIndex++, runs: parseInline(numberedMatch[2]) });
      i++;
      continue;
    }

    // Default: paragraph
    blocks.push({ type: 'p', runs: parseInline(line) });
    i++;
  }

  return blocks;
}
