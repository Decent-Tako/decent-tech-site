# Agent contract for decent-tech-site

This repository holds two things.

1. `site/`: the static public site for decent.tech. nginx serves it from the
   container in `Dockerfile`. Python tests in `tests/` check its content and
   contrast. Nothing outside `site/` is served.
2. `design-system/`: the Decent component library, a React Storybook with 425
   stories. It is a copy of the Uncomfortable Academy library. It still carries the
   Academy palette; the Decent brand kit is applied later by
   `design-system/REBRAND.md`. Start with `design-system/README.md`, then
   `design-system/REBRAND.md`.

## Rules

- Write in ASD-STE100 Simplified Technical English, in code comments, commits,
  and pull requests.
- The repository is public. Never add a font, photograph, or asset whose
  licence does not allow redistribution. The Academy face and photographs were
  left out for that reason.
- `design-system` changes go through a pull request. CI runs lint, types, the
  rubric check, every Storybook story in Chromium, and the build. Do not merge
  on red.
- Every story under `design-system/src/motion-examples/` must keep typed
  controls, a `play` function, per-file `a11y: { test: 'error' }`, and the
  `assertFaceNotFallback` guard. `npm run rubric` refuses anything else.
- Do not run npm at the repository root. Run it in `design-system/`.
- Use `gh` with REST only. Never GraphQL.

## To lift a component into the site

The site is static HTML with no JavaScript allowed by its Content Security
Policy (`script-src 'none'` in `nginx.conf`). A Storybook component cannot run
there as is. Use the library as the reference for markup, tokens, and motion
values, or change the site's policy in a separate, reviewed change.
