import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AuthRequest } from '../auth/types/auth-request';

import { ApiBearerAuth, ApiOperation, ApiTags} from  '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  // ADICIONAR ITEM AO CARRINHO
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @Post('items')
  addItem(
    @Req() req: AuthRequest,
    @Body() data: AddCartItemDto,
  ) {
    return this.cartService.addItem(
      req.user.userId,
      data,
    );
  }

  // LISTAR ITENS DO CARRINHO
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar itens do carrinho' })
  @Get()
  getCart(@Req() req: AuthRequest) {
    return this.cartService.getCart(req.user.userId);
  }
  
  // ATUALIZAR QUANTIDADE DE UM ITEM
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar quantidade de um item' })
  @Patch('items/:id')
  updateQuantity(
    @Req() req: AuthRequest,
    @Param('id') id: string,
    @Body() data: UpdateCartItemDto,
  ) {
    return this.cartService.updateItemQuantity(
      req.user.userId,
      Number(id),
      data.quantity,
    );
  }

  // REMOVER ITEM DO CARRINHO
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @Delete('items/:id')
  removeItem(
    @Req() req: AuthRequest,
    @Param('id') id: string
  ) {
    return this.cartService.removeItem(
      req.user.userId,
      Number(id)
    );
  }

  // FINALIZAR COMPRA
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Finalizar compra' })
  @Post('checkout')
  checkout(@Req() req: AuthRequest) {
    return this.cartService.checkout(
      req.user.userId,
    );
  }
}
