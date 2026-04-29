import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { CategoryModule } from '../category/category.module';
import { OrderModule } from '../orders/order.module';
import { Stock } from '../stock/stock.entity';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
@Module({
  imports: [
      TypeOrmModule.forFeature([Product,Stock]) ,
      CategoryModule,
      OrderModule
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService ,TypeOrmModule]
})
export class ProductModule {}
