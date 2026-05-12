import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async addItem(userId: number, data: AddCartItemDto) {
    // verifica produto
    const product = await this.prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      throw new BadRequestException('Produto não encontrado');
    }

    // valida estoque
    if (product.stock < data.quantity) {
      throw new BadRequestException(
        'Quantidade maior que estoque',
      );
    }

    // busca carrinho
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    // cria carrinho se não existir
    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
      });
    }

    // item já existe?
    const existingItem = await this.prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: data.productId,
      },
    });

    // soma quantidade
    if (existingItem) {
      return this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity:
            existingItem.quantity + data.quantity,
        },
      });
    }

    // cria item
    return this.prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: data.productId,
        quantity: data.quantity,
      },
    });
  }

  async getCart(userId: number) {
    // busca carrinho com itens e produtos
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                image: true,
                discount: true,
            },
          },
        },
      },
    }});
    // usuário ainda não possui carrinho
    if (!cart) {
      return {
        items: [],
      };
    };

    // calcula total
    const total = cart.items.reduce((acc, item) => {
      const priceWithDiscount =
        item.product.discount
          ? item.product.price - item.product.discount
          : item.product.price;

      return acc + priceWithDiscount * item.quantity;
    }, 0);
    return {
      ...cart,
      total,
    };
  }

  async updateItemQuantity(
    userId: number,
    itemId: number,
    quantity: number
  ) {
    // busca item
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
        product: true,
      },
    });

    // item não existe
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    // impede alterar carrinho de outro usuário
    if (item.cart.userId !== userId) {
      throw new ForbiddenException(
        'Acesso inválido',
      );
    }

    // valida estoque
    if (item.product.stock < quantity) {
      throw new BadRequestException(
        'Quantidade maior que estoque',
      );
    }

    // atualiza quantidade
    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return {
       message: 'Quantidade atualizada',
    }

  }

  // remover item
  async removeItem(
    userId: number,
    itemId: number
  ) {
    // busca item
    const item = await this.prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        cart: true,
      },
    });
    // item não encontrado
    if (!item) {
      throw new NotFoundException('Item não encontrado');
    }

    // impede remover item de outro usuário
    if (item.cart.userId !== userId) {
      throw new ForbiddenException('Acesso inválido');
    }

    // remove item
    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return {
      message: 'Item removido com sucesso',
    }
  }

  // finalizar compra
  async checkout(userId: number) {
    // busca carrinho
    const cart = await this.prisma.cart.findUnique({
      where: {
        userId,
      },

      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // carrinho vazio
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException(
        'Carrinho vazio',
      );
    }

    // valida estoque novamente
    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new BadRequestException(
          `Estoque insuficiente para ${item.product.name}`,
        );
      }
    }

    // calcula total
    const total = cart.items.reduce((acc, item) => {
      const priceWithDiscount =
        item.product.discount
          ? item.product.price - item.product.discount
          : item.product.price;

      return acc + priceWithDiscount * item.quantity;
    }, 0);

    //  TRANSAÇÃO
    return this.prisma.$transaction(async (tx) => {
      //  cria pedido
      const order = await tx.order.create({
        data: {
          userId,
          total,
        },
      });

      // cria itens
      for (const item of cart.items) {
        const priceWithDiscount =
          item.product.discount
            ? item.product.price - item.product.discount
            : item.product.price;

        // cria order item
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: priceWithDiscount,
          },
        });

        // diminui estoque
        await tx.product.update({
          where: {
            id: item.productId,
          },

          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // limpa carrinho
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return {
        message: 'Compra realizada com sucesso',
        orderId: order.id,
      };
    });
  }
}
