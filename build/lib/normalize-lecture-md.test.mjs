#!/usr/bin/env node
import { normalizeLectureMd } from './normalize-lecture-md.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const raw = '# المحاضرة 1\n\n**محتوى**';
assert(normalizeLectureMd(raw) === raw, 'passthrough without frontmatter');

const cms = `---
body: |
  # المحاضرة 1

  **محتوى**
---
`;
assert(normalizeLectureMd(cms).includes('# المحاضرة 1'), 'extract body block');
assert(normalizeLectureMd(cms).includes('**محتوى**'), 'preserve markdown');

console.log('normalize-lecture-md tests: OK');
