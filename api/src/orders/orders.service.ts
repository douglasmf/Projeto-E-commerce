import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOrderById(
    userId: number,
    orderId: number
  ) {
    // busca pedido
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // pedido não encontrado
    if (!order) {
      throw new NotFoundException('Pedido não encontrado');
    }

    // impede acessar pedido de outro usuário
    if (order.userId !== userId) {
      throw new ForbiddenException('Acesso inválido');
    }

    return order;
  }
}
