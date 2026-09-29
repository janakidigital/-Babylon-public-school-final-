# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.21.0
ARG NGINX_VERSION=1.30.4

#########################################################################
#  Stage 1: install dependencies (cached until lockfile changes)        #
#########################################################################
FROM node:${NODE_VERSION}-bookworm-slim AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund


#########################################################################
#  Stage 2: build the static bundle                                     #
#########################################################################
FROM node:${NODE_VERSION}-bookworm-slim AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

# Baked into the bundle at build time (compose passes these as build args).
# Leave empty for same-origin (relative /api, /babylon-school) so the app's fallbacks apply.
ARG VITE_API_URL
ARG VITE_CHATBOT_SCRIPT_URL
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV NODE_ENV=production

# Empty values are unset so the app's own fallbacks apply instead of an empty string.
RUN if [ -z "$VITE_API_URL" ]; then unset VITE_API_URL; fi \
    && if [ -z "$VITE_CHATBOT_SCRIPT_URL" ]; then unset VITE_CHATBOT_SCRIPT_URL; fi \
    && npm run build


#########################################################################
#  Stage 3: runtime — UNPRIVILEGED nginx, runs entirely as uid 101.     #
#  Listens on 8080 (the image default: a non-root user can bind it       #
#  with NO capabilities and NO sysctl tweaks).                           #
#########################################################################
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION}-alpine3.24 AS runner

# Setup steps need root (removing image defaults); runtime drops back to nginx.
USER root

# Replace the default virtual host and static assets.
RUN rm -f /etc/nginx/conf.d/default.conf \
 && rm -rf /usr/share/nginx/html/*

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the built bundle, owned by the unprivileged nginx user.
COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Back to the non-root user for runtime (this is how the base image ships).
USER nginx

# Container listens on 8080 (matches compose "3000:8080").
EXPOSE 8080

# busybox wget ships in the alpine image, so no extra package install is needed.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=5 \
  CMD wget -q --spider http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
