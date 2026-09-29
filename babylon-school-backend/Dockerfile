# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.21.0

#########################################################################
#  Stage 1 — base: shared starting point                                #
#########################################################################
FROM node:${NODE_VERSION}-bookworm-slim AS base

WORKDIR /app

COPY package.json package-lock.json ./





#########################################################################
#  Stage 2 — deps: full install (used only by the test stage)           #
#########################################################################
FROM base AS deps

# Install prod + dev dependencies from the lockfile, reusing the npm cache
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund





#########################################################################
#  Stage 3 — prod-deps: runtime dependencies only                       #
#########################################################################
FROM base AS prod-deps

# Install only production dependencies to keep the final image small
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev --no-audit --no-fund





#########################################################################
#  Stage 4 — test: optional CI gate, fails the build if tests fail      #
#########################################################################
# Run with: docker build --target test .
FROM deps AS test
ENV NODE_ENV=test
COPY . .
RUN npm test





#########################################################################
#  Stage 5 — runner: slim production image, non-root, no dev tools      #
#########################################################################
FROM node:${NODE_VERSION}-bookworm-slim AS runner

WORKDIR /app

# Run Node in production mode and default the app port to 5000
ENV NODE_ENV=production \
    PORT=5000

# Copy production files only (no tests, docs, local media, or secrets)
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json server.js ./
COPY --chown=node:node src ./src
COPY --chown=node:node scripts ./scripts

# Tell the app where to store uploaded media (must match the compose volume path)
ENV LOCAL_UPLOAD_DIR=/app/src/babylon_image_File
RUN mkdir -p "$LOCAL_UPLOAD_DIR" && chown -R node:node "$LOCAL_UPLOAD_DIR"

# Drop root privileges for everything from here on
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get({host:'127.0.0.1',port:process.env.PORT||5000,path:'/',timeout:4000},r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
