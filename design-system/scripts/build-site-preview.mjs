// Assembles the tree the container serves (site/ plus the bundle under
// assets/) into one output folder, for a local preview or for a hosted
// preview under a subpath. Node built-ins only.
//
// Usage: node scripts/build-site-preview.mjs --base <path> --out <dir> [--assets <dir>]
//
//   --base    The path the site is served under, for example / or
//             /decent-tech-site/site-preview/. With / the output is
//             byte-identical to the container tree: nothing is rewritten.
//             With any other base, every href="/..." and src="/..." in the
//             HTML, every href, src, and content attribute that starts with
//             https://decent.tech/, and every <loc> in sitemap.xml is
//             rewritten to start with the base.
//   --out     The output folder. It is cleared first.
//   --assets  The built bundle folder. Defaults to dist-site/assets, which
//             `npm run build:site` writes. Build the bundle with the same
//             base (SITE_BASE_PATH) or its links point at the wrong place.
//
// The script writes site/, the bundle under assets/, and nothing else.
import { cp, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DESIGN_SYSTEM_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_DIR = path.resolve(DESIGN_SYSTEM_DIR, '..');
const SITE_DIR = path.join(REPO_DIR, 'site');
const DEFAULT_ASSETS_DIR = path.join(DESIGN_SYSTEM_DIR, 'dist-site', 'assets');
const PRODUCTION_ORIGIN = 'https://decent.tech/';

function fail(message) {
  console.error(`build-site-preview: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = { base: undefined, out: undefined, assets: DEFAULT_ASSETS_DIR };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag === '--base' && value !== undefined) {
      options.base = value;
      index += 1;
    } else if (flag === '--out' && value !== undefined) {
      options.out = path.resolve(value);
      index += 1;
    } else if (flag === '--assets' && value !== undefined) {
      options.assets = path.resolve(value);
      index += 1;
    } else {
      fail(`unknown argument ${flag}`);
    }
  }
  if (!options.base) fail('--base <path> is required');
  if (!options.out) fail('--out <dir> is required');
  return options;
}

export function normaliseBase(value) {
  const trimmed = value.trim();
  if (trimmed === '' || trimmed === '/') return '/';
  return `/${trimmed.replace(/^\/+/, '').replace(/\/+$/, '')}/`;
}

// Rewrites the site-absolute references in one HTML page to the base.
export function rewriteHtml(html, base) {
  if (base === '/') return html;
  return html
    .replace(/(href|src)="\//g, `$1="${base}`)
    .replace(new RegExp(`(href|src|content)="${PRODUCTION_ORIGIN}`, 'g'), `$1="${base}`);
}

// Rewrites the <loc> entries of the sitemap to the base.
export function rewriteSitemap(xml, base) {
  if (base === '/') return xml;
  return xml.replace(new RegExp(`<loc>${PRODUCTION_ORIGIN}`, 'g'), `<loc>${base}`);
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(full)));
    else files.push(full);
  }
  return files;
}

async function isDirectory(dir) {
  try {
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const base = normaliseBase(options.base);
  const { out, assets } = options;

  if (!(await isDirectory(SITE_DIR))) fail(`${SITE_DIR} is not a folder`);
  if (!(await isDirectory(assets))) {
    fail(`${assets} is missing; run \`npm run build:site\` first`);
  }
  const protectedDirs = [REPO_DIR, SITE_DIR, DESIGN_SYSTEM_DIR, path.parse(out).root];
  if (protectedDirs.includes(out) || SITE_DIR.startsWith(`${out}${path.sep}`)) {
    fail(`refusing to clear ${out}`);
  }

  await rm(out, { recursive: true, force: true });
  await cp(SITE_DIR, out, { recursive: true });
  await cp(assets, path.join(out, 'assets'), { recursive: true });

  if (base !== '/') {
    for (const file of await listFiles(out)) {
      const relative = path.relative(out, file);
      if (relative.startsWith(`assets${path.sep}`)) continue;
      if (file.endsWith('.html')) {
        await writeFile(file, rewriteHtml(await readFile(file, 'utf8'), base));
      } else if (relative === 'sitemap.xml') {
        await writeFile(file, rewriteSitemap(await readFile(file, 'utf8'), base));
      }
    }
  }

  const count = (await listFiles(out)).length;
  console.log(`build-site-preview: ${count} files in ${out} for base ${base}`);
}

main().catch((error) => fail(error.message));
