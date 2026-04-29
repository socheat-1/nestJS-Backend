import { Controller, Post, Body, Get, BadRequestException, Param, Delete, NotFoundException, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { DeleteDateColumn } from 'typeorm';

@Controller('categories')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) { }

    @Get(':id')
    async getCategory(@Param('id') id: string) {
        const category = await this.categoryService.findById(Number(id));

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        return {
            message: 'Category fetched successfully',
            statusCode: 200,
            data: category,
        };
    }

    @Post()
    async create(@Body() body: { name: string, des: string}) {
        const category = await this.categoryService.create(body.name, body.des);
        return {
            message: 'Create category successfully ',
            statusCode: 200,
            data: category,
        }
    }

    @Get()
    async findAll() {
        return await this.categoryService.findAll();
    }

    @Put(':id')
    async updateCategory(
        @Param('id') id: string,
        @Body('category_name') category_name: string,
        @Body('des') des: string,
    ) {
        let updateCategory = await this.categoryService.updateCategory(Number(id),category_name, des);
        return {
            message: 'Category update successfully ',
            statusCode: 200,
            data: updateCategory
        }
    }

    @Delete(':id')
    async remove(@Param("id") id: string) {
        return await this.categoryService.delect(Number(id));
    }
}