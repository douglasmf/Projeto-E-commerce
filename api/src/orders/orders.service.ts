import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateOrderDto,
  ) {
    return this.prisma.order.create({
      data: {
        userId: data.userId,
        total: data.total,
        
        items: {
          create: data.items.map(
            (item) => ({
              productId:
                item.productId,
              quantity:
                item.quantity,

              price: item.price,
            }),
          ),
        },
      },

      include: {
        items: true,
      },
    });
  }

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
