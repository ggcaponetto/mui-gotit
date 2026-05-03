// Reads coverage/coverage-summary.json (jest --coverage with json-summary
// reporter) and writes a shields.io endpoint-compatible JSON to
// demo/public/coverage.json so the demo deploy serves a badge URL.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');

const summary = JSON.parse(
  readFileSync(resolve(repo, 'coverage/coverage-summary.json'), 'utf8'),
);
const pct = summary.total.lines.pct;

const color =
  pct >= 95 ? 'brightgreen' : pct >= 90 ? 'green' : pct >= 80 ? 'yellowgreen' : pct >= 70 ? 'yellow' : 'red';

const out = {
  schemaVersion: 1,
  label: 'coverage',
  message: `${pct}%`,
  color,
};

const target = resolve(repo, 'demo/public/coverage.json');
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out, null, 2) + '\n');
console.log(`coverage badge → ${target} (${pct}% / ${color})`);
