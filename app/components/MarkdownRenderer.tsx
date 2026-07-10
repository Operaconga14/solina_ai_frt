'use client';

import React from 'react';
import { MarkdownRendererProps } from '../types/interfaces';

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

// Extracts markdown pipe-tables out of the raw text before any other processing,
// replacing each with a placeholder token, and returns the rendered <table> HTML
// keyed by that token so it can be spliced back in untouched by later regex passes.
function extractTables(markdown: string): { text: string; tables: Record<string, string> } {
  const lines = markdown.split('\n');
  const tables: Record<string, string> = {};
  const outputLines: string[] = [];
  let tableIndex = 0;
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.includes('|') && i + 1 < lines.length && isTableSeparatorRow(lines[i + 1])) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      i += 2; // skip header + separator row
      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        rows.push(splitTableRow(lines[i]));
        i++;
      }

      const token = `@@TABLE_${tableIndex}@@`;
      tableIndex++;

      const headerHtml = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('');
      const rowsHtml = rows
        .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
        .join('');

      tables[token] = `<table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
      outputLines.push(token);
      continue;
    }
    outputLines.push(line);
    i++;
  }

  return { text: outputLines.join('\n'), tables };
}

function renderMarkdown(markdown: string): string {
  // Pull tables out first (before escaping/other regex passes touch pipe characters or dashes)
  const { text: withoutTables, tables } = extractTables(markdown);

  let html = escapeHtml(withoutTables);

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  // HR
  html = html.replace(/^---+$/gm, '<hr />');

  // Ordered list items -> tagged <oli> so they don't collide with unordered <li> below
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<oli>$1</oli>');
  // Group consecutive <oli> lines into a single <ol>, then convert tags to real <li>
  html = html.replace(/(<oli>.*<\/oli>\n?)+/g, (match) => {
    const items = match.replace(/<oli>(.*?)<\/oli>/g, '<li>$1</li>');
    return `<ol>${items}</ol>`;
  });

  // Unordered list items
  html = html.replace(/^[*-]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Paragraphs — wrap any remaining plain-text lines, leave block-level tags and table tokens alone
  const lines = html.split('\n');
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    if (!line) {
      i++;
      continue;
    }
    if (
      line.startsWith('<h1>') ||
      line.startsWith('<h2>') ||
      line.startsWith('<h3>') ||
      line.startsWith('<ul>') ||
      line.startsWith('<ol>') ||
      line.startsWith('<li>') ||
      line.startsWith('<hr') ||
      line.startsWith('@@TABLE_') ||
      line.endsWith('</ul>') ||
      line.endsWith('</ol>')
    ) {
      result.push(line);
    } else {
      result.push(`<p>${line}</p>`);
    }
    i++;
  }

  html = result.join('\n');

  // Splice rendered tables back in where their placeholder tokens were
  for (const [token, tableHtml] of Object.entries(tables)) {
    html = html.replace(token, tableHtml);
  }

  return html;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const html = renderMarkdown(content);

  return (
    <div className={`markdown-content ${className}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
