// create-user.dto.ts
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { StatusUser } from '../user.interface';
import { Type } from 'class-transformer';
import { Role } from '../role/roles.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  f_name: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;
}