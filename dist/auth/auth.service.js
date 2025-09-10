"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const role_enum_1 = require("../common/enums/role.enum");
let AuthService = class AuthService {
    constructor(usersService, jwtService, config) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.config = config;
    }
    async register(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing)
            throw new common_1.UnauthorizedException('Email already registered');
        const role = dto.role && Object.values(role_enum_1.Role).includes(dto.role) ? dto.role : role_enum_1.Role.User;
        const user = await this.usersService.create({ name: dto.name, email: dto.email, password: dto.password, role });
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            throw new common_1.UnauthorizedException('Invalid credentials');
        return user;
    }
    buildCookieOptions() {
        const isProd = this.config.get('NODE_ENV') === 'production';
        const domain = this.config.get('COOKIE_DOMAIN');
        const sameSite = this.config.get('COOKIE_SAMESITE') || (isProd ? 'none' : 'lax');
        return {
            httpOnly: true,
            secure: isProd,
            sameSite: sameSite,
            domain: domain || undefined,
            path: '/',
        };
    }
    async signTokens(user) {
        const accessSecret = this.config.get('JWT_ACCESS_SECRET') || 'dev_access_secret';
        const refreshSecret = this.config.get('JWT_REFRESH_SECRET') || 'dev_refresh_secret';
        const accessExpires = this.config.get('JWT_ACCESS_EXPIRES', '15m');
        const refreshExpires = this.config.get('JWT_REFRESH_EXPIRES', '7d');
        const payload = { sub: user.id, email: user.email, role: user.role };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, { secret: accessSecret, expiresIn: accessExpires }),
            this.jwtService.signAsync(payload, { secret: refreshSecret, expiresIn: refreshExpires }),
        ]);
        return { accessToken, refreshToken };
    }
    setAuthCookies(res, tokens) {
        const accessName = this.config.get('ACCESS_TOKEN_COOKIE', 'access_token');
        const refreshName = this.config.get('REFRESH_TOKEN_COOKIE', 'refresh_token');
        const options = this.buildCookieOptions();
        res.cookie(accessName, tokens.accessToken, { ...options });
        res.cookie(refreshName, tokens.refreshToken, { ...options });
    }
    clearAuthCookies(res) {
        const accessName = this.config.get('ACCESS_TOKEN_COOKIE', 'access_token');
        const refreshName = this.config.get('REFRESH_TOKEN_COOKIE', 'refresh_token');
        const options = this.buildCookieOptions();
        res.clearCookie(accessName, { ...options });
        res.clearCookie(refreshName, { ...options });
    }
    async login(dto, res) {
        const user = await this.validateUser(dto.email, dto.password);
        const tokens = await this.signTokens({ id: user.id, email: user.email, role: user.role });
        this.setAuthCookies(res, tokens);
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }
    async logout(res) {
        this.clearAuthCookies(res);
        return { success: true };
    }
    async refresh(userPayload, res) {
        const tokens = await this.signTokens({ id: userPayload.sub, email: userPayload.email, role: userPayload.role });
        this.setAuthCookies(res, tokens);
        return { success: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map