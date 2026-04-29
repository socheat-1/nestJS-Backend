// src/product/stock.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int',default: 1 })
  quantity: number;

  @Column({ type: 'varchar', length: 10 })
  type: 'IN' | 'OUT'; 

  @ManyToOne(() => Product, (product) => product.stocks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;
}