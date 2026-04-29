import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './roles.entity';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) { }

  findAll() {
    return this.roleRepository.find();
  }

  createRole(dto: CreateRoleDto) {
    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  async deleteR(id: number) {
    if (!id) {
      throw new Error('ID is required');
    }

    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Role with ID ${id} not found`);
    }
    return { id };
  }
}