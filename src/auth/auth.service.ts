import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new UnauthorizedException('Email already registered');
    const role = dto.role && Object.values(Role).includes(dto.role as Role) ? (dto.role as Role) : Role.User;
    const user = await this.usersService.create({ name: dto.name, email: dto.email, password: dto.password, role });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  private buildCookieOptions() {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    const domain = this.config.get<string>('COOKIE_DOMAIN');
    const sameSite = (this.config.get<string>('COOKIE_SAMESITE') as 'lax' | 'strict' | 'none') || (isProd ? 'none' : 'lax');
    return {
      httpOnly: true as const,
      secure: isProd,
      sameSite: sameSite as 'lax' | 'strict' | 'none',
      domain: domain || undefined,
      path: '/',
    };
  }

  private async signTokens(user: { id: string; email: string; role: Role }) {
    const accessSecret = this.config.get<string>('JWT_ACCESS_SECRET') || 'dev_access_secret';
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') || 'dev_refresh_secret';
    const accessExpires = this.config.get<string>('JWT_ACCESS_EXPIRES', '15m');
    const refreshExpires = this.config.get<string>('JWT_REFRESH_EXPIRES', '7d');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, { secret: accessSecret, expiresIn: accessExpires }),
      this.jwtService.signAsync(payload, { secret: refreshSecret, expiresIn: refreshExpires }),
    ]);
    return { accessToken, refreshToken };
  }

  private setAuthCookies(res: Response, tokens: { accessToken: string; refreshToken: string }) {
    const accessName = this.config.get<string>('ACCESS_TOKEN_COOKIE', 'access_token');
    const refreshName = this.config.get<string>('REFRESH_TOKEN_COOKIE', 'refresh_token');
    const options = this.buildCookieOptions();
    res.cookie(accessName, tokens.accessToken, { ...options });
    res.cookie(refreshName, tokens.refreshToken, { ...options });
  }

  private clearAuthCookies(res: Response) {
    const accessName = this.config.get<string>('ACCESS_TOKEN_COOKIE', 'access_token');
    const refreshName = this.config.get<string>('REFRESH_TOKEN_COOKIE', 'refresh_token');
    const options = this.buildCookieOptions();
    res.clearCookie(accessName, { ...options });
    res.clearCookie(refreshName, { ...options });
  }

  async login(dto: LoginDto, res: Response) {
    const user = await this.validateUser(dto.email, dto.password);
    const tokens = await this.signTokens({ id: user.id, email: user.email, role: user.role });
    this.setAuthCookies(res, tokens);
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  async logout(res: Response) {
    this.clearAuthCookies(res);
    return { success: true };
  }

  async refresh(userPayload: { sub: string; email: string; role: Role }, res: Response) {
    const tokens = await this.signTokens({ id: userPayload.sub, email: userPayload.email, role: userPayload.role });
    this.setAuthCookies(res, tokens);
    return { success: true };
  }
}

