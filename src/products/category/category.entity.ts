import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, Index } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity()
export class Category {

  @Index()
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({type: 'varchar', length: 100})
  category_name: string;

  @Column({ type: 'varchar', length: 255 , nullable: true })
  des?: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}