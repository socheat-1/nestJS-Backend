import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Category } from '../category/category.entity';
import { Stock } from '../stock/stock.entity';
import { Product } from './product.entity';
import { UpdateProductDto } from './dto/update-product.dto';
import { error } from 'console';



@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Stock)
        private readonly stockRepository: Repository<Stock>,
        private readonly dataSource: DataSource,
    ) { }

    async findById(id: number) {
        const product = await this.productRepository
            .createQueryBuilder('p')
            .leftJoin('p.category', 'cat',)
            .select([
                'p.id as id',
                'p.name as name',
                'p.price as price',
                'p.stock as stock',
                'p.discount as discount',
                'p.des as des',
                'p.isActive as isActive',
                'p.image as image',
                'cat.id as category_id',
                'category_name as category_name',
                'p.created_at as createdAt',
                'p.updated_at as updatedAt'
            ])
            .where('p.id = :id', { id })
            .getRawOne();
        return product;
    }


    async create(createProductDto: CreateProductDto) {


        const category = await this.categoryRepository.findOne({
            where: { category_id: createProductDto.category_id },
            select: {
                category_id: true,
                category_name: true,
            }
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        const existingProduct = await this.productRepository.findOne({
            where: { name: createProductDto.name }
        });

        if (existingProduct) {
            throw new BadRequestException('Product name alrady exists')
        }


        const product = this.productRepository.create({
            name: createProductDto.name,
            price: createProductDto.price,
            discount: createProductDto.discount,
            des: createProductDto.des,
            stock: createProductDto.stock,
            category: category,
            image: createProductDto.image,
            isActive: createProductDto.isActive ?? true

        });

        const products = await this.productRepository.save(product);

        const stockQty = createProductDto.stockQty ?? 0;

        const stock = this.stockRepository.create({
            product,
            quantity: stockQty,
            type: 'IN',
        });
        await this.stockRepository.save(stock);

        product.stock = stockQty;
        await this.productRepository.save(product);
        return {
            message: "Product Create successfully ",
            statusCode: 200,
            data: products
        }
    }

    async updateProduct(productId: number, updateProductDto: UpdateProductDto) {
        console.log('Updating category to ID:', updateProductDto.category_id);

        return await this.dataSource.transaction(async (manager) => {            

            const product = await manager.createQueryBuilder(Product,'p')
                .leftJoinAndSelect('p.category', 'cat')
                .where('p.id = :id', {id: productId})
                .getOne();

            if (!product) throw new NotFoundException('Product not found');

            // Update category if provided
            if (updateProductDto.category_id !== undefined && updateProductDto.category_id !== null) {
                const category = await manager.findOne(Category, {
                    where: { category_id: updateProductDto.category_id },
                });
                if (!category) throw new NotFoundException('Category not found');
                product.category = category;
            }

            // Update other fields
            if (updateProductDto.name !== undefined) product.name = updateProductDto.name;
            if (updateProductDto.price !== undefined) product.price = updateProductDto.price;
            if (updateProductDto.des !== undefined) product.des = updateProductDto.des;
            if (updateProductDto.image !== undefined) product.image = updateProductDto.image;
            if (updateProductDto.isActive !== undefined) product.isActive = updateProductDto.isActive;
            if (updateProductDto.discount !== undefined) product.discount = updateProductDto.discount;

            // Handle stock
            if (updateProductDto.stock !== undefined) {
                const currentStock = product.stock ?? 0;
                const newStock = Number(updateProductDto.stock);
                if (!isNaN(newStock)) {
                    const diff = newStock - currentStock;
                    if (diff !== 0) {
                        const stockRecord = manager.create(Stock, {
                            product,
                            quantity: Math.abs(diff),
                            type: diff > 0 ? 'IN' : 'OUT',
                        });
                        await manager.save(stockRecord);
                    }
                    product.stock = newStock;
                }
            }

            const updatedProduct = await manager.save(product);

            return {
                message: 'Product updated successfully ',
                statusCode: 200,
                data: updatedProduct,
            };
        });
    }


    async decreaseStock(productId: number, quantity: number) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.stock < quantity) {
            throw new BadRequestException('Not enough stock');
        }

        product.stock -= quantity;

        return this.productRepository.save(product);
    }

    //  Increase Stock (Admin Restock)
    async increaseStock(productId: number, quantity: number) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        product.stock += quantity;

        return this.productRepository.save(product);
    }

    async findAll(): Promise<Product[]> {
        let rows = await this.productRepository.createQueryBuilder('p')
            .leftJoin('category', 'cat', 'p.category_id = cat.category_id')
            .select([
                'p.id as id',
                'p.name as name',
                'p.price as price',
                'p.discount as discount',
                'p.stock as stock',
                'p.des as des',
                'p.isActive as isActive',
                'p.image as image',
                'cat.category_id as category_id',
                'cat.category_name as category_name',
                'p.created_at as createdAt',
                'p.updated_at as updatedAt'
                ,]).getRawMany();
        return rows;
    }

    async getProductStock(productId: number) {
        const product = await this.productRepository.findOne({
            where: { id: productId },
            select: {
                id: true,
                name: true,
                stock: true,
            }
        });
        if (!product) throw new Error('Product not found');

        return {
            message: 'Get stock successfully ',
            statusCode: 200,
            data: product
        };
    }

    async delete(id: number) {
        const product = await this.productRepository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        await this.productRepository.delete(id);

        return {
            message: 'Product deleted successfully',
            statusCode: 200
        };
    }

}