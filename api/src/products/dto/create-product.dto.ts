import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Smartphone'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 999.99
  })
  @IsNumber()
  price!: number;

  @ApiProperty({
    description: 'Desconto do produto',
    example: 10.0
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty({
    description: 'Estoque do produto',
    example: 100
  })
  @IsNumber()
  stock!: number;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://example.com/image.jpg'
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'ID da categoria do produto',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
}