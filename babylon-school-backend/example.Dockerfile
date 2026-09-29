# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.21.0

# ---------- Stage 1: production dependencies ----------
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund

# ---------- Stage 2 (optional): run tests with dev deps ----------
#   docker build --target test -t babylon-school-backend:test .
FROM node:${NODE_VERSION}-bookworm-slim AS test
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund
COPY . .
RUN npm test

# ---------- Stage 3: runtime ----------
FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

# App files only (no tests, docs, local media, or secrets)
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json package-lock.json server.js ./
COPY --chown=node:node src ./src
COPY --chown=node:node scripts ./scripts

# Media dir must exist and be owned by "node" so a named volume inherits
# correct permissions on first mount.
RUN mkdir -p /app/src/babylon_image_File && chown -R node:node /app/src/babylon_image_File

USER node
EXPOSE 5000

# TCP-level check: doesn't assume a specific health route exists.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
