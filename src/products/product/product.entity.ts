import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Stock } from '../stock/stock.entity';

@Entity('products')
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 5, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  des: string;

  @Column({ type: 'varchar', nullable: true })
  image: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Stock, (stock) => stock.product)
  stocks: Stock[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' }) //  explicit column name
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' }) //  explicit column name
  updatedAt: Date;
}
