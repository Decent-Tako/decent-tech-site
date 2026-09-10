// Static server for the site, shaped like the nginx container: directory
// index files, a redirect from /about to /about/, the MIME types nginx sends,
// and the response headers from nginx.conf. Node built-ins only.
//
// Usage: node scripts/serve-site.mjs [--root <dir>]... [--port <n>] [--host <addr>]
//
// Each --root is searched in order; the first root that holds the path wins.
// The default roots are ../site (the pages) and dist-site (the bundle), which
// is the tree the container serves. Every response carries
// Cache-Control: no-store so a page reload after a rebuild shows the new
// bundle.
import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const DESIGN_SYSTEM_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_DIR = path.resolve(DESIGN_SYSTEM_DIR, '..');
const DEFAULT_ROOTS = [path.join(REPO_DIR, 'site'), path.join(DESIGN_SYSTEM_DIR, 'dist-site')];
const NGINX_CONF = path.join(REPO_DIR, 'nginx.conf');

// The types nginx's mime.types sends for the files the site holds.
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'text/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.map': 'application/json',
};

export function parseArgs(argv) {
  const options = { roots: [], port: 8090, host: '127.0.0.1' };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    const value = argv[index + 1];
    if (flag === '--root' && value) {
      options.roots.push(path.resolve(value));
      index += 1;
    } else if (flag === '--port' && value) {
      options.port = Number(value);
      index += 1;
    } else if (flag === '--host' && value) {
      options.host = value;
      index += 1;
    } else {
      throw new Error(`serve-site: unknown argument ${flag}`);
    }
  }
  if (options.roots.length === 0) options.roots = DEFAULT_ROOTS;
  return options;
}

// Reads the add_header lines from nginx.conf so the dev loop sends the same
// Content Security Policy as the container. A missing file means no headers.
async function readNginxHeaders() {
  let text;
  try {
    text = await readFile(NGINX_CONF, 'utf8');
  } catch {
    return {};
  }
  const headers = {};
  for (const match of text.matchAll(/add_header\s+(\S+)\s+"([^"]*)"/g)) {
    headers[match[1]] = match[2];
  }
  return headers;
}

// Maps a URL path to the first file that exists under the roots. Returns
// { file } for a file, { redirect } for a directory without a trailing slash,
// or null when nothing matches.
async function resolvePath(roots, urlPath) {
  const decoded = decodeURIComponent(urlPath);
  const relative = path.posix.normalize(decoded).replace(/^\/+/, '');
  for (const root of roots) {
    const candidate = path.resolve(root, relative);
    if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) continue;
    let info;
    try {
      info = await stat(candidate);
    } catch {
      continue;
    }
    if (info.isDirectory()) {
      if (!decoded.endsWith('/')) return { redirect: `${decoded}/` };
      const indexFile = path.join(candidate, 'index.html');
      try {
        if ((await stat(indexFile)).isFile()) return { file: indexFile };
      } catch {
        continue;
      }
      continue;
    }
    if (info.isFile()) return { file: candidate };
  }
  return null;
}

export async function startServer(options) {
  const { roots, port, host } = options;
  const nginxHeaders = await readNginxHeaders();

  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? '/', `http://${host}:${port}`);
    const send = (status, headers, body) => {
      response.writeHead(status, { 'Cache-Control': 'no-store', ...nginxHeaders, ...headers });
      if (request.method === 'HEAD' || body === undefined) {
        response.end();
      } else {
        response.end(body);
      }
    };
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      send(405, { 'Content-Type': 'text/plain' }, 'method not allowed\n');
      return;
    }
    if (url.pathname === '/healthz') {
      send(200, { 'Content-Type': 'text/plain' }, 'ok\n');
      return;
    }
    let found;
    try {
      found = await resolvePath(roots, url.pathname);
    } catch {
      found = null;
    }
    if (!found) {
      send(404, { 'Content-Type': 'text/html; charset=utf-8' }, '<h1>404 Not Found</h1>\n');
      return;
    }
    if (found.redirect) {
      send(301, { Location: `${found.redirect}${url.search}` });
      return;
    }
    const type = MIME_TYPES[path.extname(found.file).toLowerCase()] ?? 'application/octet-stream';
    const size = (await stat(found.file)).size;
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      ...nginxHeaders,
      'Content-Type': type,
      'Content-Length': size,
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    createReadStream(found.file).pipe(response);
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, resolve);
  });

  const origin = `http://${host}:${port}/`;
  console.log(`serve-site: ${origin}`);
  for (const root of roots) console.log(`serve-site: root ${root}`);
  console.log('serve-site: reviewer checks:');
  console.log(`  curl -sI ${origin}assets/site.js | head -1`);
  console.log(`  curl -s ${origin}about/ | grep '<title>'`);
  return server;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  startServer(parseArgs(process.argv.slice(2))).catch((error) => {
    console.error(`serve-site: ${error.message}`);
    process.exit(1);
  });
}
