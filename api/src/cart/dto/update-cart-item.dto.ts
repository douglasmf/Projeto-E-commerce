import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Quantidade do item',
    example: 2
  })
  @IsNumber()
  @Min(1)
  quantity!: number;
}