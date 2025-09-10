import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
@ApiCookieAuth('access_token')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@GetUser() user: any) {
    return user;
  }

  @Get()
  @Roles(Role.Admin)
  async listUsers() {
    return this.usersService.findAll();
  }

  @Put(':id')
  @Roles(Role.Admin)
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }
}

