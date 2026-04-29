import { Body, Controller, Delete, Get, HttpCode, Param, Post } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('roles')
export class RoleController {
    constructor(private readonly roleService: RoleService) { }

    @Get()
    async getRoles() {
        const roles = await this.roleService.findAll();
        return {
            message: 'Fetach Role successfully ',
            statusCode: 200,
            data: roles
        };
    }

    @Post()
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        const role = await this.roleService.createRole(createRoleDto);
        return {
            message: 'Create Role successfully ',
            statusCode: 200,
            data: role
        }
    }

    @Delete(':id')
    async deleteRole(@Param('id') id: string) {
        if (!id) {
            throw new Error('ID is required');
        }

        const result = await this.roleService.deleteR(+id);
        return {
            message: 'Role deleted successfully ',
            statusCode: 200,
            data: result,
        };
    }
}