import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, CreateDateColumn } from 'typeorm';
import { Order } from '../order.entity';
import { Product } from 'src/products/product/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  // @ManyToOne(() => Product, (product) => product.orders)
  // product: Product;

  @Column({ type: 'int' })
  qty: number;

  @Column({ type: 'decimal' })
  price: number; // price per unit

  @CreateDateColumn()
  createAt: Date;
}