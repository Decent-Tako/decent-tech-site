# Vendored React Bits components

This folder holds copies of React Bits components from
https://github.com/DavidHDev/react-bits at one pinned commit. The commit is
in `scripts/vendor-react-bits.mjs` and in `src/react-bits/catalogue.ts`.

## Ben's decision, 2026-09-10

This library is for learning and experimentation. Components are vendored
as-is, with provenance. Every file here starts with an attribution header:
the upstream URL at the pinned commit, the commit, the copy date, the
licence, and a numbered list of local changes. A file with no local change
says `(none)`.

The licence is MIT plus Commons Clause. The full text is in
[LICENSE.md](LICENSE.md). The Commons Clause forbids selling, sublicensing,
or redistributing the components themselves, alone, in a bundle, or as a
ported version. Use in an application or website is permitted. Do not
publish this folder as a package.

## Layout

```
vendor/<section>/<name>/<UpstreamFile>
```

`<section>` is `animations`, `backgrounds`, `components`, or
`text-animations`. `<name>` is the upstream folder name in kebab case. The
files keep their upstream names. `scripts/vendor-react-bits.mjs` writes
this folder; do not copy files in by hand.

## Local changes

Keep local changes small and list every one in the header. Typical reasons:

- The library compiles with `erasableSyntaxOnly`. Parameter properties and
  enums must become plain fields and unions.
- An element `id` becomes a class so two copies can mount at once.
- A sketch gets `pause()`, `resume()`, or an `onReady` callback so the
  story can prove its state.

## Runtime policy

React Bits depends on `gsap`, `three`, `@react-three/fiber`,
`@react-three/drei`, `@react-three/postprocessing`, `@react-three/rapier`,
`ogl`, `matter-js`, `gl-matrix`, `lenis`, `maath`, `meshline`,
`postprocessing`, `@use-gesture/react`, and others. Ben's decision of
2026-09-10: install what the upstream component needs, with an exact
version pin, and record one row per package in the component's
`REACT_BITS_SOURCE.runtime`. The earlier "Motion only" rule in
`src/motion-examples/RuntimeAdditions.mdx` does not apply to vendored React
Bits components. The vendor script prints the exact `npm install` line from
the upstream registry file. The React Bits / Runtime page lists every
package from the `runtime` rows; nobody edits `RuntimeAdditions.mdx` for
React Bits.

## Lint and types

ESLint ignores this folder. TypeScript checks it. Fix a type error with the
smallest local change and record it in the header.
