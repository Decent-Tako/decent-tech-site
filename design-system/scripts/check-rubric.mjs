#!/usr/bin/env node
// Enforce the component rubric in issue #268 as a build check.
//
// A story that a reader cannot operate is a defect, and a green build must
// never hide one. Every rule here maps to a defect that reached `main` and
// was found by a person, not by CI.
//
// Usage:
//   node scripts/check-rubric.mjs            fail on any violation
//   node scripts/check-rubric.mjs --report   list violations, exit 0

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');
const REPORT_ONLY = process.argv.includes('--report');

// Sections that must meet the rubric. Add a directory here when it becomes
// a component catalogue rather than a page composition.
const ENFORCED = ['motion-examples', 'react-bits'];

// Stories that frame or index other stories rather than demonstrate a
// component. They carry no controls of their own by design. Add a path
// here deliberately; an empty set means every story is a component.
const INDEX_STORIES = new Set([]);

function walk(dir, suffix = '.stories.tsx') {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'vendor') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, suffix));
    else if (entry.endsWith(suffix)) out.push(full);
  }
  return out;
}

const violations = [];
function fail(file, rule, detail) {
  violations.push({ file: relative(SRC, file), rule, detail });
}

for (const file of walk(SRC)) {
  const rel = relative(SRC, file);
  if (!ENFORCED.some((dir) => rel.startsWith(dir))) continue;

  const source = readFileSync(file, 'utf8');
  const isIndex = INDEX_STORIES.has(rel);

  // Rubric 6. A story excluded from tests is unverified for ever after.
  // 55 stories shipped with this tag and nobody could tell.
  if (source.includes("'!test'") || source.includes('"!test"')) {
    fail(file, 'no-test-optout', "remove '!test'; every story must run in storybook:test");
  }
  if (source.includes("'!autodocs'") || source.includes('"!autodocs"')) {
    fail(file, 'no-autodocs-optout', "remove '!autodocs'; every component needs generated docs");
  }

  // Rubric 2. Without argTypes there are no controls, so nothing can be
  // configured and the story cannot demonstrate a range.
  if (!isIndex && !source.includes('argTypes')) {
    fail(file, 'no-controls', 'add argTypes so the Controls panel can change the animation');
  }

  // Rubric 3 and 6. A play function is the only executable proof that the
  // story works. A screenshot is not a proof path.
  if (!source.includes('play:')) {
    fail(file, 'no-play', 'add a play function that exercises the story and asserts its state');
  }

  // Rubric 5. Labels render in Brand Sans. document.fonts.check passes on a
  // synthesised bold, so it is not sufficient.
  if (!source.includes('assertFaceNotFallback')) {
    fail(file, 'no-font-guard', 'call assertFaceNotFallback at weight 400 and 700');
  }
  if (source.includes('document.fonts.check')) {
    fail(file, 'weak-font-check', 'replace document.fonts.check with assertFaceNotFallback');
  }

  // Rubric 6. A story file that omits the per-file setting can silently
  // follow a preview.tsx that someone set back to 'todo'.
  if (
    !source.includes("a11y: { test: 'error' }") &&
    !source.includes('a11y: { test: "error" }')
  ) {
    fail(
      file,
      'a11y-not-enforced',
      "add parameters: { a11y: { test: 'error' } } to this file's meta",
    );
  }
}

// React Bits. The Overview and Runtime pages are built from every
// `source.ts` under src/react-bits/ through import.meta.glob. A source.ts
// without REACT_BITS_SOURCE breaks the glob at build time; fail it here first.
const reactBits = join(SRC, 'react-bits');
for (const file of walk(reactBits, 'source.ts')) {
  const source = readFileSync(file, 'utf8');
  if (!/export const REACT_BITS_SOURCE\b/.test(source)) {
    fail(
      file,
      'no-react-bits-source',
      'export REACT_BITS_SOURCE: ReactBitsSource so the Overview and Runtime pages can list the component',
    );
  }
}

// Rubric 6. a11y violations must fail the build, not sit in a panel.
const preview = join(ROOT, '.storybook', 'preview.tsx');
const previewSource = readFileSync(preview, 'utf8');
if (!/a11y:\s*\{[\s\S]{0,200}?test:\s*['"]error['"]/.test(previewSource)) {
  fail(
    preview,
    'a11y-not-enforced',
    "set a11y.test to 'error' in .storybook/preview.tsx",
  );
}

if (violations.length === 0) {
  console.log('rubric check: pass');
  process.exit(0);
}

const byRule = new Map();
for (const v of violations) {
  if (!byRule.has(v.rule)) byRule.set(v.rule, []);
  byRule.get(v.rule).push(v);
}

console.log(`rubric check: ${violations.length} violations across ${byRule.size} rules\n`);
for (const [rule, list] of byRule) {
  console.log(`${rule} (${list.length})`);
  console.log(`  ${list[0].detail}`);
  for (const v of list.slice(0, 8)) console.log(`    ${v.file}`);
  if (list.length > 8) console.log(`    ... and ${list.length - 8} more`);
  console.log('');
}

console.log('Rubric: https://github.com/Decent-Tako/uncomfortable-academy/issues/268');
process.exit(REPORT_ONLY ? 0 : 1);
