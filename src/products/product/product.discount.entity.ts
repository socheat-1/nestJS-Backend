import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Discount {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  percentage: number;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @ManyToOne(() => Product)
  product: Product;
}