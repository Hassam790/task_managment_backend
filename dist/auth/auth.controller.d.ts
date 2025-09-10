import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("../common/enums/role.enum").Role;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("../common/enums/role.enum").Role;
    }>;
    logout(res: Response): Promise<{
        success: boolean;
    }>;
    refresh(user: any, res: Response): Promise<{
        success: boolean;
    }>;
}
