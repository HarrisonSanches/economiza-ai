// users.service.ts
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { User, UserDTO } from "@economiza/shared/src/types/user";
import { ObjectId } from "mongodb";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  private get usersCollection() {
    return this.dbService.getDb().collection("users");
  }

  async findMe(userId: string): Promise<User | null> {
    const user = await this.usersCollection.findOne({
      _id: new ObjectId(userId),
    });
    if (!user) throw new NotFoundException("User not found");
    return this.mongoToUser(user);
  }

  async updateMe(userId: string, update: Partial<UserDTO>): Promise<User> {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const result = await this.usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!result || !result.value) throw new NotFoundException("User not found");
    return this.mongoToUser(result.value);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.usersCollection.findOne({ _id: new ObjectId(id) });
    return user ? this.mongoToUser(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersCollection.findOne({ email });
    return user ? this.mongoToUser(user) : null;
  }

  async create(userData: UserDTO): Promise<User> {
    const existing = await this.usersCollection.findOne({
      email: userData.email,
    });
    if (existing) throw new ConflictException("Email already registered");
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 10)
      : undefined;
    const now = new Date();
    const doc = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      roles: ["user"],
      authProvider: "local",
      createdAt: now,
      updatedAt: now,
    };
    const result = await this.usersCollection.insertOne(doc);
    return this.mongoToUser({ ...doc, _id: result.insertedId });
  }

  async update(id: string, update: Partial<UserDTO>): Promise<User> {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    const result = await this.usersCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...update, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!result || !result.value) throw new NotFoundException("User not found");
    return this.mongoToUser(result.value);
  }

  async delete(id: string): Promise<void> {
    const result = await this.usersCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0)
      throw new NotFoundException("User not found");
  }

  private mongoToUser(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      roles: doc.roles,
      authProvider: doc.authProvider,
      settings: doc.settings,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
