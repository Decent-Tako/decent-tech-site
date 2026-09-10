import type { ReactBitsSection } from './catalogue';

// One row on the React Bits/Runtime page. One row per npm package the
// vendored component needs. Exact version, as installed in package.json.
export type ReactBitsRuntime = {
  package: string;
  version: string;
  licence: string;
  unpackedKb: number;
  why: string;
  repo: string;
};

// The provenance record every `src/react-bits/<section>/<name>/source.ts`
// exports as `REACT_BITS_SOURCE`. The Overview and Runtime pages read it
// through `import.meta.glob`, so a component registers itself by existing.
export type ReactBitsSource = {
  // Upstream folder name. 'FadeContent'.
  name: string;
  section: ReactBitsSection;
  // Upstream documentation page.
  page: string;
  // Upstream files at the pinned commit, as blob URLs.
  files: readonly string[];
  // The commit the files were copied from.
  sha: string;
  // ISO date of the copy.
  vendoredOn: string;
  licence: 'MIT + Commons Clause';
  runtime: readonly ReactBitsRuntime[];
};

export type ReducedMotionMode = 'user' | 'always' | 'never';
