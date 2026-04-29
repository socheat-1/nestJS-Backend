import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CategoryService {

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) { }


    async findById(id: number) {
        const category = await this.categoryRepository.findOne({
            where: { category_id: id }
        });
        return category;
    }

    async create(category_name: string, des: string) {
        const categorie_name = await this.categoryRepository.findOne({
            where: { category_name: category_name},
        });
        if (categorie_name) {
            throw new BadRequestException('Name categories already exists');
        }
        const category = this.categoryRepository.create({ category_name,des });
        return await this.categoryRepository.save(category);
    }

    async updateCategory(category_id: number, category_name: string , des: string) {
        let categoryupdate = await this.categoryRepository.findOne({ where: { category_id: category_id } });
        if (!categoryupdate) {
            throw new NotFoundException(`Category with ID ${category_id} not found`)
        }
        const existingCetegory = await this.categoryRepository.findOne({
            where: { category_name , des },
        })
        if (existingCetegory && existingCetegory.category_id !== category_id) {
            throw new BadRequestException('Name catefories already exists');
        }
        categoryupdate.category_name = category_name;
        categoryupdate.des = des;
        return await this.categoryRepository.save(categoryupdate);
    }

    async findAll() {
        let categories = await this.categoryRepository.createQueryBuilder('c')
            .select([
                'c.category_id as category_id',
                'c.category_name as category_name',
                'c.des as des',
                'c.createdAt as createdAt'
            ]).getRawMany();

        const total = categories.length;
        
        return {
            message: 'Category fetched successfully ',
            statusCode: 200,
            data: categories,
            total_category: total
        }
    }

    async delect(id: number) {
        const category = await this.categoryRepository.findOne({ where: { category_id: id } })

        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }

        await this.categoryRepository.delete(id);
        return {
            message: 'Category deleted successfully ',
            statusCode: 200
        }

    }
}