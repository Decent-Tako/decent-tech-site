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
