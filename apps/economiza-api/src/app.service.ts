// app.service.ts
import { Injectable } from "@nestjs/common";
import { DatabaseService } from "./database/database.service";

@Injectable()
export class AppService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getHealth(): Promise<{
    status: string;
    db: string;
    timestamp: string;
  }> {
    const dbHealthy = await this.databaseService.isHealthy();
    return {
      status: "ok",
      db: dbHealthy ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    };
  }
}
