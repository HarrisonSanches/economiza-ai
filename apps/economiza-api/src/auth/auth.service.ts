// auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { UserDTO } from "@economiza/shared/src/types/user";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    // Find user in DB to get hashed password
    const dbUser = await this.usersService["usersCollection"].findOne({
      email,
    });
    if (!dbUser || !dbUser.password)
      throw new UnauthorizedException("Invalid credentials");
    const isMatch = await bcrypt.compare(password, dbUser.password);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");
    return user;
  }

  async login(credentials: { email: string; password: string }) {
    const user = await this.validateUser(
      credentials.email,
      credentials.password
    );
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }

  async register(userData: UserDTO) {
    const user = await this.usersService.create(userData);
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }
  async loginWithGoogle(user: any) {
    if (!user) {
      throw new UnauthorizedException("No user from Google");
    }
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }
}
