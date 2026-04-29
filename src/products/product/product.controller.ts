import { Controller, Post, Body, Get, Param, NotFoundException, UseInterceptors, UploadedFile, Delete, ParseIntPipe, BadRequestException, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { OrderService } from '../orders/order.service';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import axios from 'axios';
import { sanitizeFileName } from 'src/utils/sanitizeFileName';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateOrderDto } from '../orders/dto/create-order.dto';

@Controller('products')
export class ProductController {

    constructor(
        private readonly productService: ProductService,
        private readonly orderService: OrderService,
    ) { }
    private readonly uploadPath = './uploads/products';
    private ensureFolder() {
        if (!existsSync(this.uploadPath)) mkdirSync(this.uploadPath, { recursive: true });
    }
    private sanitizeFileName(name: string): string {
        // Remove unsafe characters and replace spaces with hyphens
        return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    @Get(':id')
    async getProduct(@Param('id') id: string) {
        const product = await this.productService.findById(Number(id));

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return {
            message: 'Product fetched successfully ',
            statusCode: 200,
            data: product,
        };
    }

    @Get()
    async getProducts() {
        const product = await this.productService.findAll();
        return {
            message: 'Product fetched successfully ',
            statusCode: 200,
            data: product
        }
    }

    @Post('create-orders')
    async createOrder(@Body() createOrderDto: CreateOrderDto) {
        return await this.orderService.createOrder(createOrderDto);
    }

    @Post('create-product')
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createProductDto: CreateProductDto,
    ) {
        if (file) {
            const baseUrl = 'http://localhost:3003/uploads/products';
            createProductDto.image = `${baseUrl}/${file.filename}`;
        }
        else if (createProductDto.image?.startsWith('http')) {
            createProductDto.image = createProductDto.image; 
            
            createProductDto.image = 'https://via.placeholder.com/150';
        }

        return await this.productService.create(createProductDto);
    }

    // @Put(':id') 
    // async updateProduct(
    //     @Param('id', ParseIntPipe) id: number,
    //     @Body() updateProductDto: UpdateProductDto,
    // ) {
    //     return this.productService.update(id, updateProductDto);
    // }

    @Put(':id')
    async UpdateProductDto(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.updateProduct(id, updateProductDto)
    }


    @Get(':id/stock')
    async getStock(@Param('id', ParseIntPipe) id: number) {
        const productStock = await this.productService.getProductStock(id);
        if (productStock.data.stock === 0) {
            throw new NotFoundException(`Don't have Stock`)
        }
        return await this.productService.getProductStock(id);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.productService.delete(Number(id));
    }

}