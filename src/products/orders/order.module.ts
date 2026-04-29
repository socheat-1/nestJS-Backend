// product/orders/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order } from './order.entity';
import { User } from '../../users/user.entity';
import { Product } from '../product/product.entity';
import { Stock } from '../stock/stock.entity';
import { OrderItem } from './dto/order-item.dto';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, User, Product,Stock,OrderItem]),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}