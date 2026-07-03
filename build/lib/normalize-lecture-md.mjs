/**
 * Decap CMS saves lectures with YAML frontmatter (`body: |`).
 * Strip frontmatter so the parser sees raw SCHEMA.md markdown.
 * @param {string} text
 */
export function normalizeLectureMd(text) {
  const t = text.replace(/^\uFEFF/, '');
  if (!t.startsWith('---')) return text;

  const end = t.indexOf('\n---', 3);
  if (end === -1) return text;

  const fm = t.slice(4, end);
  const after = t.slice(end + 4).trimStart();

  const bodyBlock = fm.match(/^body:\s*\|\n([\s\S]*)$/m);
  if (bodyBlock) {
    const lines = bodyBlock[1].split('\n');
    const indent = (lines.find(l => l.trim())?.match(/^(\s*)/)?.[1] || '').length;
    const body = lines.map(l => l.slice(indent)).join('\n').trimEnd();
    return body ? `${body}\n` : '';
  }

  const bodyFolded = fm.match(/^body:\s*>\n([\s\S]*)$/m);
  if (bodyFolded) {
    const lines = bodyFolded[1].split('\n');
    const indent = (lines.find(l => l.trim())?.match(/^(\s*)/)?.[1] || '').length;
    const body = lines.map(l => l.slice(indent)).join('\n').trimEnd();
    return body ? `${body}\n` : '';
  }

  const bodyQuoted = fm.match(/^body:\s*(['"])([\s\S]*?)\1\s*$/m);
  if (bodyQuoted) return `${bodyQuoted[2]}\n`;

  const bodyInline = fm.match(/^body:\s*(.+)$/m);
  if (bodyInline && !bodyInline[1].startsWith('|') && !bodyInline[1].startsWith('>')) {
    return `${bodyInline[1].trim()}\n`;
  }

  if (after) return after.endsWith('\n') ? after : `${after}\n`;
  return text;
}
