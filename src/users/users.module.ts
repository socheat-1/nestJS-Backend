// users.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { Category } from 'src/products/category/category.entity';
import { Product } from 'src/products/product/product.entity';
import { Role } from './role/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category,User,Role]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService,TypeOrmModule], 
})
export class UsersModule {}