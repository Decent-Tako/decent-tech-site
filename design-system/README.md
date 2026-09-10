# Decent component library

React Storybook of 425 stories, copied from the Uncomfortable Academy library
(`Decent-Tako/uncomfortable-academy/design-system`, commit c8f6258, 2026-09-10)
carried over with its Academy palette. It is not rebranded yet. The procedure for
the Decent brand kit, when it arrives, is in [REBRAND.md](REBRAND.md).

## Sections

| Section | What it holds |
| --- | --- |
| Brand | Colour tokens, the two face aliases, the wordmark, contrast report |
| Typography | `@tailwindcss/typography` reading surfaces with 800-word test walls |
| Pages | Four page compositions: Hero, Article, Feature scroll, Navigation |
| Motion examples | 115 components: 79 rebuilt from motion.dev examples, 30 vendored from Motion Primitives, plus Apple Intelligence, App Store, Globe, and three earlier Primitives. Every one has typed controls, Replay or Pause, a `play` test, and attribution |
| UI primitives | Base UI gallery |
| Styled systems | Mantine and Radix Themes galleries |
| Icon resources | Lucide, Phosphor, Tabler, Heroicons comparison |
| Charts and data | Recharts and visx on one cohort snapshot |

Start at **Motion examples / Overview** for the component list and **Motion
examples / Runtime additions** for every package beyond `motion` 13.2.0 with
its size and reason.

## Scripts

Run these from `design-system/`:

```bash
npm ci
npm run storybook          # http://127.0.0.1:6012, no browser opened
npm run storybook:test     # rubric check, then every story in Chromium
npm run storybook:build    # storybook-static/
npm run lint
npm run type
npm run rubric
```

## Finding a component

`http://127.0.0.1:6012/index.json` lists every story id. A story id is the
title lower-cased with slashes as dashes, then `--` and the story name:
`motion-examples-motion-primitives-dock--academy`. Open it at
`/?path=/story/<id>`. Each component folder under `src/motion-examples/` holds
the component, its stories file, and any adapter it needs; `source.ts` in each
folder records the upstream URL, version, and licence.

## Lifting a component into an app

1. Copy the component folder and the CSS file it imports.
2. Copy `src/brand/tokens.css` and the three font files under `public/fonts/`,
   or bind the two aliases to your own faces.
3. Install `motion` 13.2.0. If the component's folder or Runtime additions
   names another package, install that version too.
4. Keep the attribution comment and the licence text.

## Rules

The rubric script refuses any Motion example story that opts out of tests or
docs, has no `argTypes`, has no `play` function, does not call
`assertFaceNotFallback`, or lacks per-file `a11y: { test: 'error' }`. CI runs
it before the tests. Do not merge on red.
