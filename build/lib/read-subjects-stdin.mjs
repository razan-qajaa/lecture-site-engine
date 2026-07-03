import { fstatSync } from 'node:fs';

/** True when stdin carries piped or redirected data (safe to read until EOF). */
export function stdinHasPipedInput() {
  if (process.stdin.isTTY === true) return false;
  if (process.stdin.isTTY === false) return true;
  try {
    const stat = fstatSync(0);
    if (stat.isFIFO() || stat.isFile()) return true;
    return false;
  } catch {
    return false;
  }
}

/** @returns {Promise<string[]>} subject paths year-N/id, one per line */
export async function readSubjectsFromStdin() {
  if (!stdinHasPipedInput()) return [];
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  const text = Buffer.concat(chunks).toString('utf8').trim();
  if (!text) return [];
  return text.split('\n').map(s => s.trim()).filter(Boolean);
}
