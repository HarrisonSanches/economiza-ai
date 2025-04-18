# Economiza Aí! Monorepo Architecture Plan

This document outlines the proposed architecture for the "Economiza Aí!" project monorepo.

**1. Directory Structure**

A standard monorepo layout using Turborepo and Bun, with `apps` for deployable applications and `packages` for shared libraries.

```mermaid
graph TD
    A[economiza-ai/] --> B(apps/);
    A --> C(packages/);
    A --> D(package.json);
    A --> E(turbo.json);
    A --> F(bun.lockb);
    A --> G(.gitignore);
    A --> H(docker-compose.yml);
    A --> I(Dockerfile.base); # Optional base Docker image

    B --> B1(economiza-app/);
    B --> B2(economiza-api/);
    B --> B3(economiza-notifications/);

    C --> C1(economiza-shared/);

    B1 --> B1a(src/);
    B1 --> B1b(package.json);
    B1 --> B1c(Dockerfile);
    B1 --> B1d(... other React config);

    B2 --> B2a(src/);
    B2 --> B2b(package.json);
    B2 --> B2c(Dockerfile);
    B2 --> B2d(... other NestJS config);

    B3 --> B3a(src/); # Placeholder
    B3 --> B3b(package.json);
    B3 --> B3c(Dockerfile); # Placeholder
    B3 --> B3d(... basic config);

    C1 --> C1a(src/);
    C1 --> C1b(package.json);
    C1 --> C1c(tsconfig.json);
```

- `/apps`: Contains the deployable applications.
  - `economiza-app`: React frontend (web, iOS, Android).
  - `economiza-api`: NestJS backend.
  - `economiza-notifications`: Placeholder Kafka service.
- `/packages`: Contains shared code.
  - `economiza-shared`: TypeScript interfaces, types, DTOs, etc.
- `/`: Root configuration files.
  - `package.json`: Root dependencies and workspace definitions.
  - `turbo.json`: Turborepo pipeline configuration.
  - `bun.lockb`: Bun lockfile.
  - `.gitignore`: Standard ignores.
  - `docker-compose.yml`: Local development orchestration.
  - `Dockerfile.base` (Optional): Base Docker image.

**2. Root Configuration Files**

- **`package.json` (Root):**
  ```json
  {
    "name": "economiza-ai-monorepo",
    "private": true,
    "workspaces": ["apps/*", "packages/*"],
    "scripts": {
      "build": "turbo run build",
      "dev": "turbo run dev --parallel",
      "lint": "turbo run lint",
      "test": "turbo run test",
      "clean": "turbo run clean && rm -rf node_modules",
      "format": "prettier --write \"**/*.{ts,tsx,md,json}\""
    },
    "devDependencies": {
      "turbo": "latest",
      "typescript": "latest",
      "prettier": "latest"
    },
    "packageManager": "bun@latest"
  }
  ```
- **`turbo.json`:**
  ```json
  {
    "$schema": "https://turbo.build/schema.json",
    "pipeline": {
      "build": {
        "dependsOn": ["^build"],
        "outputs": ["dist/**", ".next/**", "build/**", ".expo/**"]
      },
      "lint": {},
      "test": {
        "dependsOn": ["^build"],
        "outputs": ["coverage/**"]
      },
      "dev": {
        "cache": false,
        "persistent": true
      },
      "clean": {
        "cache": false
      }
    }
  }
  ```
- **`.gitignore` (Basic):**

  ```gitignore
  # Bun
  node_modules
  *.bun
  bun.lockb

  # Turbo
  .turbo

  # Build outputs
  dist
  build
  .next
  .expo
  .output

  # OS specific
  .DS_Store
  Thumbs.db

  # Logs
  logs
  *.log

  # Env files
  .env
  .env.*
  !.env.example

  # IDE specific
  .vscode
  .idea
  ```

**3. Workspace Configuration (Examples)**

- **`packages/economiza-shared/package.json`:**
  ```json
  {
    "name": "@economiza/shared",
    "version": "1.0.0",
    "main": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "scripts": {
      "build": "tsc -p tsconfig.json",
      "clean": "rm -rf dist"
    },
    "devDependencies": {
      "typescript": "workspace:*"
    }
  }
  ```
- **`apps/economiza-api/package.json`:**
  ```json
  {
    "name": "@economiza/api",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "build": "nest build",
      "start:dev": "nest start --watch",
      "dev": "bun run start:dev",
      "lint": "eslint .",
      "test": "jest",
      "clean": "rm -rf dist"
    },
    "dependencies": {
      "@nestjs/common": "latest",
      "@nestjs/core": "latest",
      "@nestjs/platform-express": "latest",
      "mongodb": "latest",
      "@economiza/shared": "workspace:*"
    },
    "devDependencies": {
      "@nestjs/cli": "latest",
      "@nestjs/schematics": "latest",
      "@nestjs/testing": "latest",
      "typescript": "workspace:*",
      "eslint": "latest",
      "jest": "latest"
    }
  }
  ```

**4. Docker Setup**

- **`apps/economiza-api/Dockerfile` (Example):**

  ```dockerfile
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
  ```

- **`docker-compose.yml` (Root):**

  ```yaml
  version: "3.8"
  services:
    mongo:
      image: mongo:latest
      container_name: economiza-mongo
      ports:
        - "27017:27017"
      volumes:
        - mongo_data:/data/db
      networks:
        - economiza-net

    # kafka:
    #   image: docker.redpanda.com/redpandadata/redpanda:latest
    #   container_name: economiza-kafka
    #   command:
    #     - redpanda start --smp 1 --overprovisioned --node-id 0 --kafka-addr internal://0.0.0.0:9092,external://0.0.0.0:19092 --advertise-kafka-addr internal://kafka:9092,external://localhost:19092
    #   ports:
    #     - "19092:19092"
    #     - "9644:9644"
    #   networks:
    #     - economiza-net

    api:
      container_name: economiza-api-dev
      build:
        context: .
        dockerfile: apps/economiza-api/Dockerfile
        target: development # Optional dev target
      volumes:
        - ./apps/economiza-api:/usr/src/app/apps/economiza-api
        - ./packages/economiza-shared:/usr/src/app/packages/economiza-shared
        - /usr/src/app/node_modules
      ports:
        - "3001:3000"
      depends_on:
        - mongo
        # - kafka
      environment:
        - DATABASE_URL=mongodb://mongo:27017/economiza
        # - KAFKA_BROKERS=kafka:9092
      networks:
        - economiza-net
      command: bun run dev

    app:
      container_name: economiza-app-dev
      build:
        context: .
        dockerfile: apps/economiza-app/Dockerfile
        target: development # Optional dev target
      volumes:
        - ./apps/economiza-app:/usr/src/app/apps/economiza-app
        - ./packages/economiza-shared:/usr/src/app/packages/economiza-shared
        - /usr/src/app/node_modules
      ports:
        - "3000:3000"
      depends_on:
        - api
      environment:
        - NEXT_PUBLIC_API_URL=http://localhost:3001 # Or REACT_APP_API_URL
      networks:
        - economiza-net
      command: bun run dev

    # notifications:
    #   container_name: economiza-notifications-dev
    #   build:
    #     context: .
    #     dockerfile: apps/economiza-notifications/Dockerfile
    #   volumes:
    #     - ./apps/economiza-notifications:/usr/src/app/apps/economiza-notifications
    #     - ./packages/economiza-shared:/usr/src/app/packages/economiza-shared
    #     - /usr/src/app/node_modules
    #   depends_on:
    #     - kafka
    #   environment:
    #     - KAFKA_BROKERS=kafka:9092
    #   networks:
    #     - economiza-net
    #   command: bun run dev

  networks:
    economiza-net:
      driver: bridge

  volumes:
    mongo_data:
  ```

````

**5. Conventions and Guidelines**

*   **Cross-Workspace Imports:** Use scoped package names (e.g., `@economiza/shared`). Bun workspaces and TypeScript path aliases handle resolution.
    ```typescript
    // In apps/economiza-api/src/some.service.ts
    import { UserDto } from '@economiza/shared/dto/user.dto';
    ```
*   **Versioning:** Start with independent versioning for packages. Consider tools like `changesets` later if needed.
*   **Kafka Integration (`economiza-notifications`):**
    *   Add Kafka client library (`kafkajs`) when needed.
    *   Producers likely in `economiza-api`.
    *   Consumers implemented in `economiza-notifications`.
    *   Define event payloads in `economiza-shared`.
````
