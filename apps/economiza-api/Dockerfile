# ---- Base ----
FROM oven/bun:latest as base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base as deps
COPY package.json bun.lockb ./
COPY apps/economiza-api/package.json ./apps/economiza-api/
COPY packages/economiza-shared/package.json ./packages/economiza-shared/
RUN bun install --frozen-lockfile --production=false

# ---- Build ----
FROM base as build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN bun run turbo run build --filter=@economiza/api...

# ---- Release ----
FROM oven/bun:latest as release
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/economiza-api/dist ./dist
COPY apps/economiza-api/package.json .

EXPOSE 3000
CMD ["bun", "run", "dist/main.js"]