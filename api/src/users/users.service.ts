import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Criar novo usuário
  async create(data: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const user = await this.prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email já está em uso');
      }

      throw error;
    }
  }
  // Buscar usuário por email (para autenticação)
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
  
  // Listar todos usuários (apenas para admin)
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Buscar usuário por ID (apenas para admin)
  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  // Deletar usuário por ID (apenas para admin)
  async remove(id: number) {

  const orders =
    await this.prisma.order.findMany({
      where: { userId: id },
      select: { id: true },
    });

  const orderIds =
    orders.map((order) => order.id);

  await this.prisma.orderItem.deleteMany({
    where: {
      orderId: {
        in: orderIds,
      },
    },
  });

  await this.prisma.order.deleteMany({
    where: { userId: id },
  });

  return this.prisma.user.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
}


}
