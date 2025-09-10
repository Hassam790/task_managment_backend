import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async findAll(): Promise<Array<Pick<User, 'id' | 'name' | 'email' | 'role'>>> {
    const users = await this.usersRepo.find({ where: { role: Not(Role.Admin) } });
    return users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
  }

  async create(data: { name: string; email: string; password: string; role?: User['role'] }): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = this.usersRepo.create({ name: data.name, email: data.email, passwordHash, role: data.role });
    return this.usersRepo.save(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (dto.password) {
      user.passwordHash = await bcrypt.hash(dto.password, 10);
    }
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role !== undefined) user.role = dto.role;
    return this.usersRepo.save(user);
  }
}

