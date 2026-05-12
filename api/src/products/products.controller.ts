import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  Patch,
  Query
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

import { ApiBearerAuth, ApiOperation, ApiTags} from  '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  // público
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @Get()
  findAll(
    @Query('name') name?: string,
    @Query('categoryId') categoryId?: string
  ) {
    return this.productsService.findAll({
      name,
      categoryId: categoryId ? Number(categoryId) : undefined,
    });
  }

  // público
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  // ADMIN
  @ApiOperation({ summary: 'Criar novo produto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Post()
  create(@Body() data: CreateProductDto) {
    return this.productsService.create(data);
  }

  // ADMIN
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() data: UpdateProductDto
  ) {
    return this.productsService.update(Number(id), data);
  }

  // ADMIN
  @ApiOperation({ summary: 'Deletar produto' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(Number(id));
  }
}
