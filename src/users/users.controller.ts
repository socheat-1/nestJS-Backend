import { Controller, Get, Param, NotFoundException, Post, Body, Delete, Put, HttpCode, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';

@Controller('users')
export class UsersController {
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
    constructor(private readonly usersService: UsersService) { }


    @Get()
    async getAll() {
        const users = await this.usersService.findAll();
        return {
            message: 'Users fetched successfully ',
            statusCode: 200,
            data: users,
        };
    }

    @Get(':id')
    async getProfile(@Param('id') id: string) {
        const user = await this.usersService.findById(Number(id));
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return {
            message: 'Profile fetched successfully ',
            statusCode: 200,
            data: user,
        };
    }

    @Post('create-users')
    async create(@Body() createUserDto: CreateUserDto) {
        console.log('Received body:', createUserDto);
        console.log('Role ID received:', createUserDto.roleId);
        console.log('Role ID type:', typeof createUserDto.roleId);
        console.log(error)
        const user = await this.usersService.create(createUserDto);

        const { ...userWithoutPassword } = user;

        return {
            message: 'User created successfully ',
            statusCode: 200,
            data: userWithoutPassword,
        };
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ) {
        // Make sure id is a number
        if (!id) throw new BadRequestException('User ID is required');
 
        // Update user via service
        const updatedUser = await this.usersService.update(id, updateUserDto);

        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return {
            message: 'User updated successfully ',
            statusCode: 200,
            data: updatedUser, // include role if your service populates it
        };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.delete(Number(id));
    }
}
