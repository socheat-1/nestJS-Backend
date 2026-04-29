import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/user.entity';
import { Role } from 'src/users/role/roles.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule, // ADD THIS
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.register({
      secret: 'SECRET_KEY',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, UsersService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}