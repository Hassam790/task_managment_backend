import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../common/enums/role.enum';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly config;
    constructor(usersService: UsersService, jwtService: JwtService, config: ConfigService);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: Role;
    }>;
    validateUser(email: string, password: string): Promise<import("../users/entities/user.entity").User>;
    private buildCookieOptions;
    private signTokens;
    private setAuthCookies;
    private clearAuthCookies;
    login(dto: LoginDto, res: Response): Promise<{
        id: string;
        name: string;
        email: string;
        role: Role;
    }>;
    logout(res: Response): Promise<{
        success: boolean;
    }>;
    refresh(userPayload: {
        sub: string;
        email: string;
        role: Role;
    }, res: Response): Promise<{
        success: boolean;
    }>;
}
