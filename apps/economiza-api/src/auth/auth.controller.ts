// auth.controller.ts
import { Controller, Post, Body, Get, UseGuards, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() userData: any) {
    return this.authService.register(userData);
  }

  @Post("login")
  async login(@Body() credentials: any) {
    return this.authService.login(credentials);
  }
  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth() {
    // Handled by passport, redirects to Google
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthCallback(@Req() req: Request) {
    // req.user is populated by GoogleStrategy
    return this.authService.loginWithGoogle(req.user);
  }
}
