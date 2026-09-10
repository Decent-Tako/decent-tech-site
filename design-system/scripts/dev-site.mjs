// The site dev loop: `vite build --watch` for the bundle plus the static
// server from serve-site.mjs for site/ and dist-site/. A change under
// src/site/ or src/react-bits/ rebuilds dist-site/assets/ in the background;
// a page reload then shows the new bundle. Node built-ins only.
//
// Usage: node scripts/dev-site.mjs [--port <n>] [--host <addr>]
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseArgs, startServer } from './serve-site.mjs';

const DESIGN_SYSTEM_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VITE_BIN = path.join(DESIGN_SYSTEM_DIR, 'node_modules', '.bin', 'vite');

const options = parseArgs(process.argv.slice(2));

const watcher = spawn(VITE_BIN, ['build', '--config', 'vite.site.config.ts', '--watch'], {
  cwd: DESIGN_SYSTEM_DIR,
  stdio: 'inherit',
});

const stop = () => {
  watcher.kill('SIGTERM');
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);

watcher.on('exit', (code) => {
  console.error(`dev-site: vite build --watch exited with code ${code ?? 'null'}`);
  process.exit(code ?? 1);
});

startServer(options).catch((error) => {
  console.error(`dev-site: ${error.message}`);
  watcher.kill('SIGTERM');
  process.exit(1);
});
