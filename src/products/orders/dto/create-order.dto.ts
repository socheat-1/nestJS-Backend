
import { IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {

  @IsNumber()
  productId: number;

  @IsNumber()
  qty: number;

}

export class CreateOrderDto {

  @IsNumber()
  userId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

}