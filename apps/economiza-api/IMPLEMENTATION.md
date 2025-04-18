# NestJS API Implementation Plan

## 1. Application Structure

```
apps/economiza-api/
├── src/
│   ├── main.ts                 # Application bootstrap
│   ├── app.module.ts           # Root module
│   ├── app.controller.ts       # Basic controller with health check
│   ├── app.service.ts          # Basic service
│   └── database/
│       ├── database.module.ts  # MongoDB connection module
│       └── database.service.ts # Database connection service
```

## 2. Implementation Details

### 2.1 Main Application Setup (main.ts)

- Bootstrap NestJS application
- Configure CORS for frontend (http://localhost:3000)
- Set up global validation pipe
- Configure Swagger/OpenAPI documentation
- Listen on port 3001 (as per docker-compose.yml)

### 2.2 Database Configuration

- MongoDB connection using environment variables
- Connection string: mongodb://mongo:27017/economiza
- Implement connection retry logic
- Add health check endpoint for database connection

### 2.3 Basic Application Structure

- Implement health check endpoint in AppController
- Set up basic error handling and logging
- Configure proper TypeScript settings

## 3. Implementation Steps

1. Create basic NestJS structure:

   ```typescript
   // main.ts
   import { NestFactory } from "@nestjs/core";
   import { AppModule } from "./app.module";

   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     app.enableCors({
       origin: process.env.FRONTEND_URL || "http://localhost:3000",
     });
     await app.listen(3001);
   }
   bootstrap();
   ```

2. Set up MongoDB connection:

   ```typescript
   // database/database.module.ts
   import { Module } from "@nestjs/common";
   import { MongoClient } from "mongodb";

   @Module({
     providers: [
       {
         provide: "DATABASE_CONNECTION",
         useFactory: async () => {
           const client = await MongoClient.connect(
             "mongodb://mongo:27017/economiza"
           );
           return client.db();
         },
       },
     ],
     exports: ["DATABASE_CONNECTION"],
   })
   export class DatabaseModule {}
   ```

3. Implement health check endpoint:

   ```typescript
   // app.controller.ts
   import { Controller, Get } from "@nestjs/common";
   import { AppService } from "./app.service";

   @Controller()
   export class AppController {
     constructor(private readonly appService: AppService) {}

     @Get("health")
     getHealth() {
       return {
         status: "ok",
         timestamp: new Date().toISOString(),
       };
     }
   }
   ```

## 4. Next Steps

After this initial setup, we will:

1. Implement proper environment variable handling
2. Add logging configuration
3. Set up testing infrastructure
4. Add continuous integration workflow
