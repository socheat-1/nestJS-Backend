import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, JoinColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from 'src/users/user.entity';
import { OrderItem } from './dto/order-item.dto';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @ManyToOne(() => User, user => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;


  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];

  @ManyToMany(() => Product)
  @JoinTable({
    name: 'order_products',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'orderId',
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
  })
  products: Product[];

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', default: 0 })
  totalPrice: number;

  @CreateDateColumn()
  createdAt: Date;
}