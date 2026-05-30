import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';

import { AuthRequest } from '../auth/types/auth-request';
import { ApiBearerAuth, ApiOperation, ApiTags} from  '@nestjs/swagger';

import { CreateOrderDto } from './dto/create-order.dto';



@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
  ) {}

  @Post()
  create(
    @Body()
    body: CreateOrderDto,
  ) {
    return this.ordersService.create(
      body,
    );
  }

  // rota para buscar os pedidos do usuário logado
  @ApiOperation({ summary: 'Listar pedidos do usuário logado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findMyOrders(@Req() req: AuthRequest) {
    return this.ordersService.findUserOrders(
      req.user.userId,
    );
  }

  // rota para buscar um pedido específico do usuário
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOrderById(
    @Req() req: AuthRequest,
    @Param('id') id: string,
  ) {
    return this.ordersService.findOrderById(
      req.user.userId,
      Number(id),
    );
  }
}