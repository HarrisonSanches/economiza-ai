# ---- Base ----
FROM oven/bun:latest as base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base as deps
COPY package.json bun.lockb ./
COPY apps/economiza-notifications/package.json ./apps/economiza-notifications/
COPY packages/economiza-shared/package.json ./packages/economiza-shared/
RUN bun install --frozen-lockfile --production=false

# ---- Build ----
FROM base as build
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN echo "Placeholder for notifications build"

# ---- Release ----
FROM oven/bun:latest as release
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/apps/economiza-notifications/dist ./dist
COPY apps/economiza-notifications/package.json .

EXPOSE 4000
CMD ["bun", "run", "dev"]