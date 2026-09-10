# Decent Technology Group site

This repository contains the static public site for `decent.tech`.

Run the content tests with:

```sh
python3 -m unittest discover -s tests -v
```

Build and run the container with:

```sh
docker build -t decent-tech-site .
docker run --rm -p 8080:8080 decent-tech-site
```

## Previews

A preview of `main` is published with each push at
<https://decent-tako.github.io/decent-tech-site/site-preview/>. It is the
container tree served under a subpath; the page copy is the same as
production.

To look at the site locally without a container, run these in
`design-system/`:

```sh
npm run dev:site       # http://127.0.0.1:8090/, rebuilds the bundle on change
npm run preview:site   # the exact container tree, built once, on the same port
```

The details are in [design-system/README.md](design-system/README.md).
