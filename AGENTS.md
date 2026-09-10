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

The site is static HTML. Its Content Security Policy (`nginx.conf`) allows
scripts and styles from the site's own origin only (`script-src 'self'`,
`style-src 'self'`). Inline scripts, inline styles, `eval`, `data:` URLs, and
third-party origins stay blocked. To run a Storybook component on the site,
bundle it into a file under the served root and reference that file from the
page. Do not widen the policy for a component; change the component.
