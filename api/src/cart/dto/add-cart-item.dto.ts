import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNumber } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1
  })
  @IsNumber()
  productId!: number;

  @ApiProperty({
    description: 'Quantidade do item',
    example: 2
  })
  @IsNumber()
  quantity!: number;
}