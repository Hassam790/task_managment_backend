import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: any): Promise<any>;
    updateUser(id: string, dto: UpdateUserDto): Promise<import("./entities/user.entity").User>;
}
