import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // cria um novo produto
  async create(data: CreateProductDto) {
    return this.prisma.product.create({
      data,
    });
  }

  // atualiza um produto
  async update(id: number, data: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  // procura por produtos, podendo filtrar por nome e categoria
  async findAll(filters?: { name?: string; categoryId?: number }) {
  return this.prisma.product.findMany({
    where: {
      name: filters?.name
        ? {
            contains: filters.name,
            mode: 'insensitive',
          }
        : undefined,

      categoryId: filters?.categoryId,
    },
  });
}

  // procura por um produto específico pelo ID
  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // remove um produto pelo ID
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
