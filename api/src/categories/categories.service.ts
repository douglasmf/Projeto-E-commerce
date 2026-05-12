import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  // Criar uma nova categoria (Admin)
  async create(data: CreateCategoryDto) {
    return this.prisma.category.create({
        data,
    });
  }

  // Listar todas as categorias (público)
  async findAll() {
    return this.prisma.category.findMany({
        include: {
            products: true,
        },
    });
  }

  // Atualizar uma categoria (Admin)
  async update(id: number, data: UpdateCategoryDto) {
    return this.prisma.category.update({
        where: { id },
        data,
    });
  }

  // Deletar uma categoria (Admin)
  async remove(id: number) {
  // 🔍 verifica se existem produtos
  const productsCount = await this.prisma.product.count({
    where: {
      categoryId: id,
    },
  });

  // ❌ impede deletar
  if (productsCount > 0) {
    throw new BadRequestException(
      'Não é possível deletar categoria com produtos vinculados',
    );
  }

  // ✅ remove categoria
  return this.prisma.category.delete({
    where: { id },
  });
}
 
    
  
}
