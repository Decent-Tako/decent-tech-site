#!/usr/bin/env node
// Vendor one React Bits component and scaffold its story folder.
//
// Usage:
//   node scripts/vendor-react-bits.mjs <Section>/<Name>   one component
//   node scripts/vendor-react-bits.mjs --catalogue         regenerate src/react-bits/catalogue.ts
//
// <Section> is Animations, Backgrounds, Components, or TextAnimations.
// <Name> is the upstream folder name, for example FadeContent.
//
// The script is idempotent. It never overwrites a file that exists, so a
// second run after local edits changes nothing. Delete a file to regenerate it.
//
// Steps for one component:
//   1. Read public/r/<Name>-TS-CSS.json at the pinned commit for the file
//      list and the npm dependencies.
//   2. Download src/ts-default/<Section>/<Name>/* from raw.githubusercontent.com
//      and write each file under src/react-bits/vendor/<section>/<name>/ with
//      an attribution header.
//   3. Resolve each dependency to an exact version with `npm view` and print
//      the `npm install --save-exact` line.
//   4. Write source.ts, <Name>.tsx, and <Name>.stories.tsx under
//      src/react-bits/<section>/<name>/ from templates that pass the rubric.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

export const REACT_BITS_SHA = '625f25025fed1c28e2de7d3ac5f12ee83542844d';
const REPO = 'DavidHDev/react-bits';
const RAW = `https://raw.githubusercontent.com/${REPO}/${REACT_BITS_SHA}`;
const BLOB = `https://github.com/${REPO}/blob/${REACT_BITS_SHA}`;
const SITE = 'https://reactbits.dev';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src', 'react-bits');
const TODAY = new Date().toISOString().slice(0, 10);

const SECTIONS = {
  Animations: { folder: 'animations', label: 'Animations' },
  Backgrounds: { folder: 'backgrounds', label: 'Backgrounds' },
  Components: { folder: 'components', label: 'Components' },
  TextAnimations: { folder: 'text-animations', label: 'Text animations' },
};

const COMMENT_HEADER = new Set(['tsx', 'ts', 'jsx', 'js', 'css', 'scss', 'glsl', 'frag', 'vert']);

function kebab(name) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

function display(name) {
  return name
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
}

// A single-quoted string literal for generated code. Backslashes first.
function quote(value) {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function constName(name) {
  return kebab(name).replace(/-/g, '_').toUpperCase();
}

function log(message) {
  console.log(message);
}

function writeOnce(path, content) {
  if (existsSync(path)) {
    log(`  exists   ${path.slice(ROOT.length)}`);
    return false;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  log(`  wrote    ${path.slice(ROOT.length)}`);
  return true;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.text();
}

async function fetchBytes(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return Buffer.from(await response.arrayBuffer());
}

function header(sourceUrl, page, relativeLicence) {
  return [
    '/*',
    ' * Vendored from React Bits.',
    ` * Source: ${sourceUrl}`,
    ` * Page: ${page}`,
    ` * Commit: ${REACT_BITS_SHA}`,
    ` * Date: ${TODAY}`,
    ` * Licence: MIT + Commons Clause (see ${relativeLicence}). The Commons Clause forbids`,
    ' * selling, sublicensing, or redistributing the components themselves.',
    ' *',
    ' * Local changes:',
    ' * (none)',
    ' */',
    '',
  ].join('\n');
}

// Put the header after a leading directive such as 'use client'.
function withHeader(content, head) {
  const match = content.match(/^(['"]use [a-z]+['"];?\r?\n)/);
  if (match) return `${match[1]}${head}${content.slice(match[1].length)}`;
  return `${head}${content}`;
}

// package.json dependency lookup for "already installed".
function installedVersion(pkg) {
  const packageJson = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  return packageJson.dependencies?.[pkg] ?? packageJson.devDependencies?.[pkg] ?? null;
}

function npmView(spec, fields) {
  try {
    const out = execFileSync('npm', ['view', spec, ...fields, '--json'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return JSON.parse(out);
  } catch {
    return null;
  }
}

function splitSpec(spec) {
  const at = spec.lastIndexOf('@');
  if (at <= 0) return { pkg: spec, range: 'latest' };
  return { pkg: spec.slice(0, at), range: spec.slice(at + 1) };
}

// Resolve `pkg@^1.2.3` to the highest matching exact version and its metadata.
function resolveDependency(spec) {
  const { pkg, range } = splitSpec(spec);
  const installed = installedVersion(pkg);
  let version = installed ? installed.replace(/^[\^~]/, '') : null;
  if (!version) {
    const versions = npmView(`${pkg}@${range}`, ['version']);
    if (Array.isArray(versions)) version = versions[versions.length - 1];
    else if (typeof versions === 'string') version = versions;
  }
  let licence = 'TODO';
  let unpackedKb = 0;
  let repo = `https://www.npmjs.com/package/${pkg}`;
  if (version) {
    const meta = npmView(`${pkg}@${version}`, ['license', 'dist.unpackedSize', 'repository.url']);
    if (meta && typeof meta === 'object') {
      if (typeof meta.license === 'string') licence = meta.license;
      if (typeof meta['dist.unpackedSize'] === 'number') {
        unpackedKb = Math.round(meta['dist.unpackedSize'] / 1024);
      }
      if (typeof meta['repository.url'] === 'string') {
        repo = meta['repository.url']
          .replace(/^git\+/, '')
          .replace(/^git:\/\//, 'https://')
          .replace(/^ssh:\/\/git@/, 'https://')
          .replace(/\.git$/, '');
      }
    }
  }
  return { pkg, range, installed, version: version ?? 'TODO', licence, unpackedKb, repo };
}

// Best effort: `prop = default` pairs from the component's destructuring.
function guessDefaults(tsx) {
  const start = tsx.search(/=\s*\(\s*\{|\(\s*\{\s*\n/);
  if (start < 0) return [];
  const end = tsx.indexOf('})', start);
  if (end < 0) return [];
  const block = tsx.slice(start, end);
  const out = [];
  for (const line of block.split('\n')) {
    const match = line.match(/^\s*([A-Za-z_$][\w$]*)\s*=\s*(.+?),?\s*$/);
    if (!match) continue;
    const [, prop, value] = match;
    if (prop === 'children' || prop === 'className' || prop === 'style') continue;
    if (value.includes('=>') || value.endsWith('{') || value.endsWith('[')) continue;
    out.push({ prop, value: value.replace(/,$/, '') });
  }
  return out;
}

function controlFor(value) {
  if (/^-?\d+(\.\d+)?$/.test(value)) return `{ type: 'number' }`;
  if (value === 'true' || value === 'false') return `'boolean'`;
  if (/^['"`]#[0-9a-fA-F]{3,8}['"`]$/.test(value)) return `'color'`;
  if (/^['"`]/.test(value)) return `'text'`;
  return `'object'`;
}

function templateSource({ section, name, files, page, runtime, defaults }) {
  const runtimeRows = runtime
    .map(
      (r) => `    {
      package: '${r.pkg}',
      version: '${r.version}',
      licence: ${quote(r.licence)},
      unpackedKb: ${r.unpackedKb},
      why: 'TODO: what the package does here that motion cannot.',
      repo: '${r.repo}',
    },`,
    )
    .join('\n');
  const defaultLines = defaults.map((d) => `  ${d.prop}: ${d.value},`).join('\n');
  return `import type { ReactBitsSource, ReducedMotionMode } from '../../types';

export const REACT_BITS_SOURCE: ReactBitsSource = {
  name: '${name}',
  section: '${section}',
  page: '${page}',
  files: [
${files.map((f) => `    '${f}',`).join('\n')}
  ],
  sha: '${REACT_BITS_SHA}',
  vendoredOn: '${TODAY}',
  licence: 'MIT + Commons Clause',
  runtime: [
${runtimeRows}
  ],
};

// One entry per upstream prop, with the upstream default. Guessed from the
// vendored file; check every value against it.
export const ${constName(name)}_DEFAULTS = {
${defaultLines}
  reducedMotion: 'never' as ReducedMotionMode,
};
`;
}

function templateWrapper({ section, name, defaults }) {
  const meta = SECTIONS[section];
  const NAME = constName(name);
  const props = defaults.map((d) => `  ${d.prop}?: (typeof ${NAME}_DEFAULTS)['${d.prop}'];`).join('\n');
  const destructure = defaults
    .map((d) => `  ${d.prop} = ${NAME}_DEFAULTS.${d.prop},`)
    .join('\n');
  const pass = defaults.map((d) => `        ${d.prop}={${d.prop}}`).join('\n');
  return `import { useState } from 'react';

import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import Upstream${name} from '../../vendor/${meta.folder}/${kebab(name)}/${name}';
import { ${NAME}_DEFAULTS, REACT_BITS_SOURCE } from './source';

export type ${name}Props = {
${props}
  reducedMotion?: ReducedMotionMode;
};

export function ${name}({
${destructure}
  reducedMotion = ${NAME}_DEFAULTS.reducedMotion,
}: ${name}Props) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="${display(name)}"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={<>TODO: what moves and how.</>}
          controls="TODO: what Pause and Replay do."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="TODO: what stays fixed and why. Which upstream props are not controls."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="${kebab(name)}-stage"
      stageData={{ 'data-reduced': reduce ? 'true' : 'false', 'data-run': String(run) }}
    >
      <Upstream${name}
        key={run}
${pass}
      >
        {/* TODO: Academy copy from src/pages/content.ts and photos through publicAsset(). */}
      </Upstream${name}>
    </ReactBitsFrame>
  );
}
`;
}

function templateStory({ section, name, page, defaults }) {
  const meta = SECTIONS[section];
  const NAME = constName(name);
  const argTypes = defaults
    .map(
      (d) => `    ${d.prop}: {
      control: ${controlFor(d.value)},
      description: ${quote(`Upstream default ${d.value}.`)},
    },`,
    )
    .join('\n');
  return `import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent } from 'storybook/test';

import { assertFaceNotFallback } from '../../../brand/fontFallback';
import { ${name} } from './${name}';
import { ${NAME}_DEFAULTS } from './source';

const meta = {
  title: 'React Bits/${meta.label}/${display(name)}',
  component: ${name},
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Vendored React Bits ${display(name)}, commit ${REACT_BITS_SHA.slice(0, 7)}, ${TODAY}. Mechanism: TODO. Licence MIT + Commons Clause. Page ${page} . TODO: runtime, what Pause and Replay do.',
      },
    },
  },
  tags: ['autodocs'],
  args: { ...${NAME}_DEFAULTS },
  argTypes: {
${argTypes}
    reducedMotion: {
      control: 'select',
      options: ['user', 'always', 'never'],
      description: 'always shows the final state at once.',
    },
  },
} satisfies Meta<typeof ${name}>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

async function playBrand(canvas: Canvas) {
  await assertFaceNotFallback('Brand Sans', 400);
  await assertFaceNotFallback('Brand Sans', 700);
  await expect(canvas.getByRole('heading', { name: '${display(name)}' })).toBeVisible();
}

async function playPause(canvas: Canvas) {
  const stage = canvas.getByTestId('${kebab(name)}-stage');
  await userEvent.click(canvas.getByRole('button', { name: 'Pause' }));
  await expect(stage).toHaveAttribute('data-paused', 'true');
  await expect(canvas.getByRole('button', { name: 'Resume' })).toBeVisible();
  return stage;
}

export const Default: Story = {
  args: { ...${NAME}_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    // TODO: interact with the stage and assert the state changed.
    const stage = await playPause(canvas);
    await userEvent.click(canvas.getByRole('button', { name: 'Replay' }));
    await expect(stage).toHaveAttribute('data-paused', 'false');
  },
};

// TODO: rename to the variant it shows and change one upstream prop.
export const Variant: Story = {
  args: { ...${NAME}_DEFAULTS },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    await playPause(canvas);
  },
};

export const ReducedMotion: Story = {
  args: { ...${NAME}_DEFAULTS, reducedMotion: 'always' },
  play: async ({ canvas }) => {
    await playBrand(canvas);
    const stage = await playPause(canvas);
    await expect(stage).toHaveAttribute('data-reduced', 'true');
  },
};
`;
}

async function vendorComponent(arg) {
  const [section, name] = arg.split('/');
  if (!SECTIONS[section] || !name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
    throw new Error(
      `Expected <Section>/<Name>, for example Animations/FadeContent. Sections: ${Object.keys(SECTIONS).join(', ')}.`,
    );
  }
  const meta = SECTIONS[section];
  const page = `${SITE}/${meta.folder}/${kebab(name)}`;
  log(`React Bits ${section}/${name} at ${REACT_BITS_SHA.slice(0, 7)}`);

  const registryUrl = `${RAW}/public/r/${name}-TS-CSS.json`;
  const registry = JSON.parse(await fetchText(registryUrl));
  const relativePaths = registry.files.map((file) =>
    file.path.includes('/') ? file.path : `${name}/${file.path}`,
  );

  const vendorDir = join(SRC, 'vendor', meta.folder, kebab(name));
  const files = [];
  let mainTsx = '';
  for (const relative of relativePaths) {
    const upstreamPath = `src/ts-default/${section}/${relative}`;
    const sourceUrl = `${BLOB}/${upstreamPath}`;
    files.push(sourceUrl);
    const target = join(vendorDir, relative.slice(relative.indexOf('/') + 1));
    const ext = relative.slice(relative.lastIndexOf('.') + 1).toLowerCase();
    if (COMMENT_HEADER.has(ext)) {
      const text = await fetchText(`${RAW}/${upstreamPath}`);
      if (relative.endsWith(`${name}.tsx`)) mainTsx = text;
      writeOnce(target, withHeader(text, header(sourceUrl, page, '../../LICENSE.md')));
    } else {
      log(`  binary   ${relative} gets no header; the sibling file header covers it`);
      writeOnce(target, await fetchBytes(`${RAW}/${upstreamPath}`));
    }
  }

  const runtime = registry.dependencies.map(resolveDependency);
  const defaults = mainTsx ? guessDefaults(mainTsx) : [];

  const storyDir = join(SRC, meta.folder, kebab(name));
  writeOnce(join(storyDir, 'source.ts'), templateSource({ section, name, files, page, runtime, defaults }));
  writeOnce(join(storyDir, `${name}.tsx`), templateWrapper({ section, name, defaults }));
  writeOnce(join(storyDir, `${name}.stories.tsx`), templateStory({ section, name, page, defaults }));

  const toInstall = runtime.filter((r) => !r.installed && r.version !== 'TODO');
  log('');
  for (const r of runtime) {
    if (r.installed) log(`  ${r.pkg} is installed at ${r.installed}; upstream asks ${r.range}.`);
  }
  if (toInstall.length > 0) {
    log(`  npm install --save-exact ${toInstall.map((r) => `${r.pkg}@${r.version}`).join(' ')}`);
  } else if (runtime.length === 0) {
    log('  No runtime package. Nothing to install.');
  } else {
    log('  Nothing to install.');
  }
  log('');
  log(`  Next: open src/react-bits/${meta.folder}/${kebab(name)}/ and follow src/react-bits/IMPORT.md.`);
}

async function regenerateCatalogue() {
  const url = `https://api.github.com/repos/${REPO}/git/trees/${REACT_BITS_SHA}?recursive=1`;
  const tree = JSON.parse(await fetchText(url));
  if (tree.truncated) throw new Error('The tree response is truncated.');
  const by = { Animations: [], Backgrounds: [], Components: [], TextAnimations: [] };
  for (const entry of tree.tree) {
    const match = entry.path.match(
      /^src\/ts-default\/(Animations|Backgrounds|Components|TextAnimations)\/([^/]+)$/,
    );
    if (entry.type === 'tree' && match) by[match[1]].push(match[2]);
  }
  const block = Object.entries(by)
    .map(([section, names]) => `  ${section}: [\n${names.sort().map((n) => `    '${n}',`).join('\n')}\n  ],`)
    .join('\n');
  const path = join(SRC, 'catalogue.ts');
  const current = readFileSync(path, 'utf8');
  const next = current.replace(
    /(export const CATALOGUE[^{]*\{\n)[\s\S]*?(\n\};)/,
    `$1${block}$2`,
  );
  writeFileSync(path, next);
  const total = Object.values(by).reduce((sum, names) => sum + names.length, 0);
  log(`catalogue.ts: ${total} components (${Object.entries(by).map(([s, n]) => `${n.length} ${s}`).join(', ')})`);
}

const arg = process.argv[2];
if (!arg) {
  console.error('Usage: node scripts/vendor-react-bits.mjs <Section>/<Name> | --catalogue');
  process.exit(2);
}
try {
  if (arg === '--catalogue') await regenerateCatalogue();
  else await vendorComponent(arg);
} catch (error) {
  console.error(`vendor-react-bits: ${error.message}`);
  process.exit(1);
}
