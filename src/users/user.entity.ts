import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { StatusUser } from './user.interface';
import { Order } from 'src/products/orders/order.entity';
import { Role } from './role/roles.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  f_name: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 15, unique: true })
  phone: string;

  // @Column({ unique: true, nullable: true })
  // email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;


  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}