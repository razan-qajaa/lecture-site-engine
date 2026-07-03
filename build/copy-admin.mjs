#!/usr/bin/env node
/**
 * Copy admin/ (Decap CMS) into dist/admin/ for GitHub Pages.
 */
import { existsSync } from 'node:fs';
import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENGINE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ADMIN_SRC = path.join(ENGINE_ROOT, 'admin');
const ADMIN_DEST = path.join(ENGINE_ROOT, 'dist', 'admin');

async function main() {
  if (!existsSync(path.join(ADMIN_SRC, 'index.html'))) {
    console.log('Skipping admin copy — admin/index.html not found');
    return;
  }
  await mkdir(path.join(ENGINE_ROOT, 'dist'), { recursive: true });
  await cp(ADMIN_SRC, ADMIN_DEST, { recursive: true });
  console.log('✓ dist/admin/ (Decap CMS)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
