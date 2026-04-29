export class CreateProductDto {
  name: string;
  price: number;
  discount?:  number;
  stock: number;
  des?: string;
  isActive?: boolean;
  category_id: number;
  image?: string;
  stockQty?: number;
}