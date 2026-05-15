import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    price_full?: number;

    @IsOptional()
    @IsString()
    des?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    stock?: number;  //  Keep only this one

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    discount?: number;

    @IsOptional()
    @IsString()
    image?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @Type(() => Number)  //  Add this to transform string to number
    @IsNumber()
    category_id?: number;
}