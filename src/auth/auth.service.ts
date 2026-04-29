import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    console.log('User from DB:', user);
    console.log('Password to compare:', user?.password);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials'); 
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...result } = user; // remove password
    return result;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      message: 'Login successful',
      statusCode: 200,
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        f_name: user.f_name,
        username: user.username,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}