import { Controller, Post, Headers, Get, NotFoundException, Param, UseGuards, Request, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  // Login route
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    console.log('Login body received:', body); // 🔹 debug
    if (!body || !body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    const user = await this.authService.validateUser(body.username, body.password);
    return this.authService.login(user);
  }
}