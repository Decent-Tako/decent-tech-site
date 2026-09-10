# Stage 1: build the site bundle (assets/site.js and site.css) from design-system/.
FROM node:20-alpine AS build

WORKDIR /app
COPY design-system/package.json design-system/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY design-system/ ./
RUN npm run build:site

# Stage 2: serve site/ plus the bundle with unprivileged nginx.
FROM nginxinc/nginx-unprivileged:1.29-alpine

COPY --chown=101:101 nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=101:101 site/ /usr/share/nginx/html/
COPY --from=build --chown=101:101 /app/dist-site/assets/ /usr/share/nginx/html/assets/

USER 101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
