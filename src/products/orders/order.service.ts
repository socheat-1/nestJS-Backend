// product/orders/order.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order } from './order.entity';
import { User } from '../../users/user.entity';
import { Product } from '../product/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Stock } from '../stock/stock.entity';
import { OrderItem } from './dto/order-item.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(Stock) private stockRepository: Repository<Stock>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
  ) { }

  async findById(id: number) {
    let order = await this.orderRepository.findOne({
      where: { orderId: id },
      relations: {
        user: true,
        items: { product: true },
      },
      select: {
        orderId: true,
        totalPrice: true,
        quantity: true,
        user: {
          id: true,
          f_name: true,
          phone: true
        },
        products: true
      }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return {
      message: 'View Order fetched successfully ',
      statusCode: 200,
      data: order
    };
  }

async getOrders(page: number, limit: number) {
  const [items, total_order] = await this.orderItemRepository.findAndCount({
    relations: {
      product: {
        category: true,
      },
      order: {
        user: true,
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    order: { id: 'DESC' },
  });

  const data = items.map(item => ({
    id: item.id,

    user_id: item.order?.user?.id ?? null,
    user_name: item.order?.user?.f_name ?? 'N/A',

    image: item.product?.image ?? null,
    product_name: item.product?.name ?? 'N/A',
    category_name: item.product?.category?.category_name ?? 'N/A',

    discount: item.product?.discount ?? 0,
    qty: item.qty,
    price_after_dis: item.price,

    createAt: item.createAt
      ? new Date(item.createAt).toISOString()
      : null,
  }));

  return {
    data,
    total_order,
    page,
    limit,
  };
}

  async createOrder(createOrderDto: CreateOrderDto) {
    const { userId, items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    let totalPrice = 0;
    let totalQty = 0;

    // This will hold OrderItem entities
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await this.productRepository.findOne({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.productId} not found`);
      }

      if (product.stock < item.qty) {
        throw new BadRequestException(
          `Product "${product.name}" has only ${product.stock} items in stock`
        );
      }

      // Reduce product stock
      product.stock -= item.qty;
      await this.productRepository.save(product);

      // Save stock movement
      await this.stockRepository.save(
        this.stockRepository.create({
          product,
          quantity: item.qty,
          type: 'OUT',
        }),
      );

      // Calculate price
      const price = Number(product.price);
      const discount = Number(product.discount ?? 0);
      const finalPrice = price - (price * discount) / 100;

      totalPrice += finalPrice * item.qty;
      totalQty += item.qty;

      // Create order item
      orderItems.push(
        this.orderItemRepository.create({
          product,
          qty: item.qty,
          price: finalPrice,
        })
      );
    }

    // Create the order with items (not products)
    const order = this.orderRepository.create({
      user,
      items: orderItems, //  attach order items here
      totalPrice: Number(totalPrice.toFixed(2)),
      quantity: totalQty,
    });

    const savedOrder = await this.orderRepository.save(order);

    const completeOrder = await this.orderRepository.findOne({
      where: { orderId: savedOrder.orderId },
      relations: {
        user: true,
        items: { product: true },
      },
      select: {
        user: {
          id: true,
          f_name: true,
          phone: true,
        },
      },
    });

    return {
      message: "Order Product successfully ",
      statusCode: 200,
      data: completeOrder,
    };
  }
}