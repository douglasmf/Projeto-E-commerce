import {
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  userId!: number;

  @IsNumber()
  total!: number;

  @IsArray()
  items!: {
    productId: number;

    quantity: number;

    price: number;
  }[];
}