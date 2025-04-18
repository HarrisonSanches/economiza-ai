import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { MongoClient, Db } from "mongodb";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private readonly logger = new Logger(DatabaseService.name);

  async onModuleInit() {
    const uri =
      process.env.DATABASE_URL || "mongodb://localhost:27017/economiza";
    let attempts = 0;
    const maxAttempts = 5;
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

    while (attempts < maxAttempts) {
      try {
        this.client = new MongoClient(uri);
        await this.client.connect();
        this.db = this.client.db();
        this.logger.log("Connected to MongoDB");
        break;
      } catch (error) {
        attempts++;
        this.logger.error(
          `MongoDB connection attempt ${attempts} failed: ${error}`
        );
        if (attempts >= maxAttempts) {
          throw new Error(
            "Failed to connect to MongoDB after multiple attempts"
          );
        }
        await delay(2000);
      }
    }
  }

  getDb(): Db {
    if (!this.db) {
      throw new Error("Database not connected");
    }
    return this.db;
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.close();
      this.logger.log("MongoDB connection closed");
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.db?.command({ ping: 1 });
      return true;
    } catch {
      return false;
    }
  }
}
