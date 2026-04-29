import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductModule } from './products/product/product.module';
import { CategoryModule } from './products/category/category.module';
import { OrderModule } from './products/orders/order.module';
import { RoleModule } from './users/role/role.module';

import { User } from './users/user.entity';
import { Product } from './products/product/product.entity';
import { Order } from './products/orders/order.entity';
import { Stock } from './products/stock/stock.entity';
import { Role } from './users/role/roles.entity';
import path from 'path';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';

@Module({
  imports: [

    ConfigModule.forRoot({ isGlobal: true }),
    I18nModule.forRoot({
      fallbackLanguage: 'kh',
      loaderOptions: {
        path: path.join(process.cwd(), 'src/i18n/'), 
        watch: true,
      },
      resolvers: [
        new HeaderResolver(['x-lang']),
        AcceptLanguageResolver,
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Product, Order, Stock, Role],
      autoLoadEntities: true,
      synchronize: true, // ⚠️ Use only in development
    }),

    UsersModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    RoleModule,
  ],
})
export class AppModule { }