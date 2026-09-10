// Self-registering catalogue. Every `source.ts` under a section folder is
// found by the glob at build time. Nobody edits a list when a component
// lands; the Overview and Runtime pages read this module.
import {
  CATALOGUE,
  CATALOGUE_TOTAL,
  SECTIONS,
  displayName,
  pageUrl,
  storyId,
  storyTitle,
  type ReactBitsSection,
} from './catalogue';
import type { ReactBitsRuntime, ReactBitsSource } from './types';

const modules = import.meta.glob<{ REACT_BITS_SOURCE: ReactBitsSource }>(
  './**/source.ts',
  { eager: true },
);

export const BUILT: readonly ReactBitsSource[] = Object.entries(modules)
  .map(([path, module]) => {
    const source = module.REACT_BITS_SOURCE;
    if (!source) {
      throw new Error(`${path} does not export REACT_BITS_SOURCE`);
    }
    return source;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const builtByKey = new Map(
  BUILT.map((source) => [`${source.section}/${source.name}`, source]),
);

export type CatalogueRow = {
  section: ReactBitsSection;
  sectionLabel: string;
  name: string;
  title: string;
  page: string;
  storyTitle: string;
  storyId: string;
  built: ReactBitsSource | null;
};

// Every upstream component, in section order and alphabetical inside.
export const CATALOGUE_ROWS: readonly CatalogueRow[] = SECTIONS.flatMap(
  ({ section, label }) =>
    CATALOGUE[section].map((name) => ({
      section,
      sectionLabel: label,
      name,
      title: displayName(name),
      page: pageUrl(section, name),
      storyTitle: storyTitle(section, name),
      storyId: storyId(section, name),
      built: builtByKey.get(`${section}/${name}`) ?? null,
    })),
);

export const BUILT_TOTAL = BUILT.length;
export const PLANNED_TOTAL = CATALOGUE_TOTAL - BUILT_TOTAL;

export type RuntimeRow = ReactBitsRuntime & {
  components: readonly string[];
  whys: readonly string[];
};

// Runtime packages across every built component, one row per package and
// version, with the components that need it.
export const RUNTIME_ROWS: readonly RuntimeRow[] = (() => {
  const rows = new Map<string, RuntimeRow>();
  for (const source of BUILT) {
    for (const runtime of source.runtime) {
      const key = `${runtime.package}@${runtime.version}`;
      const title = displayName(source.name);
      const row = rows.get(key);
      if (row) {
        rows.set(key, {
          ...row,
          components: [...row.components, title],
          whys: row.whys.includes(runtime.why)
            ? row.whys
            : [...row.whys, runtime.why],
        });
      } else {
        rows.set(key, { ...runtime, components: [title], whys: [runtime.why] });
      }
    }
  }
  return [...rows.values()].sort((a, b) =>
    a.package.localeCompare(b.package) || a.version.localeCompare(b.version),
  );
})();

// A link that moves the Storybook manager, not the docs iframe.
export function storyHref(id: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  return `${base}?path=/story/${id}`;
}
