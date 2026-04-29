import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from './role/roles.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  /** Find user by ID */
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id }, relations: ['role'] });
  }

  /** Get all users (pagination) */
  async findAll(page = 1) {
    // const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      // skip,
      // take: limit,
      relations: ['role'],
    });

    const safeUsers = users.map(({ password, ...user }) => ({
      ...user,
      role: user.role.name,
      status: user.status ?? true,
    }));

    return {
      users: safeUsers,
      page,
      // limit,
      total,
      total_page: Math.ceil(total),
    };
  }

  async findOne(identifier: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: [{ username: identifier }, { phone: identifier }],
      relations: ['role'],
      select: ['id', 'username', 'f_name', 'phone', 'role', 'password', 'status'], // 🔹 include password
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { f_name, username, phone, password, roleId, status } = createUserDto;

    // Check for duplicates
    if (await this.userRepository.findOne({ where: { username } })) {
      throw new BadRequestException('Username already exists');
    }
    if (await this.userRepository.findOne({ where: { phone } })) {
      throw new BadRequestException('Phone already exists');
    }

    // Find role
    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) throw new BadRequestException('Role not found');

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = this.userRepository.create({
      f_name,
      username,
      phone,
      password: hashedPassword,
      role,
      status: status ?? true,
    });

    // Save user
    const savedUser = await this.userRepository.save(newUser);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = savedUser;

    return {
      data: {
        ...userWithoutPassword,
        role: role.name,
        status: status ?? true,
      },
    };
  }

  /** Update user */
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
      select: ['id', 'f_name', 'username', 'phone', 'status', 'role', 'password',]
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.username) {
      const exists = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      // if (exists && exists.id !== id) {
      //   throw new BadRequestException('Username already exists');
      // }

      user.username = updateUserDto.username;
    }

    if (updateUserDto.phone) user.phone = updateUserDto.phone;
    if (updateUserDto.f_name) user.f_name = updateUserDto.f_name;

    //  ADD THIS (status update)
    if (updateUserDto.status !== undefined) {
      user.status = updateUserDto.status;
    }

    if (updateUserDto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUserDto.roleId },
      });

      if (!role) throw new BadRequestException('Role not found');

      user.role = role;
    }

    const updatedUser = await this.userRepository.save(user);

    const { password, ...userWithoutPassword } = updatedUser;

    return userWithoutPassword;
  }

  /** Delete user */
  async delete(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    await this.userRepository.delete(id);

    return {
      message: 'User deleted successfully ',
      statusCode: 200,
    };
  }
}