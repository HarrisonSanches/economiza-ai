// users.controller.ts
import { Controller, Get, Patch, Body, Param } from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  async getMe() {
    // TODO: Replace with actual user ID from auth context
    return this.usersService.findMe("mock-user-id");
  }

  @Patch("me")
  async updateMe(@Body() update: any) {
    // TODO: Replace with actual user ID from auth context
    return this.usersService.updateMe("mock-user-id", update);
  }

  // Admin endpoints (placeholders)
  @Get(":id")
  async getUser(@Param("id") id: string) {
    return { id, name: "Admin View User" };
  }

  @Patch(":id")
  async updateUser(@Param("id") id: string, @Body() update: any) {
    return { id, ...update };
  }
}
