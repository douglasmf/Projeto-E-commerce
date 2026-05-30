import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Req,
  Body,
  Param,
} from '@nestjs/common';

import { UsersService } from './users.service';
// guards
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
// decorator de roles
import { Roles } from '../auth/roles.decorator';

import { AuthRequest } from '../auth/types/auth-request';
import { ApiBearerAuth, ApiOperation, ApiTags} from  '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(
      @Body() data: CreateUserDto,
    ) {
      return this.usersService.create(data);
    }

    // QUALQUER USUÁRIO LOGADO
    @ApiOperation({ summary: 'Obter perfil do usuário' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req: AuthRequest) {
        return req.user;
    }

    // ADMIN - listar todos usuários
    @ApiOperation({ summary: 'Listar todos os usuários' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get()
    getAllUsers() {
        return this.usersService.findAll();
    }

    // ADMIN - buscar usuário por id
    @ApiOperation({ summary: 'Buscar usuário por ID' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get('admin')
    getAdminData() {
        return { message: 'Área de admin' };
    }

    // ADMIN - deletar usuário

    @ApiOperation({ summary: 'Deletar usuário' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete('delete/:id')
    async deleteUser(
        @Param('id') id: string
    )   {
        return await this.usersService.remove( 
          Number(id)
        );
    }

    // ADMIN - buscar usuário por id - por último
    
    @ApiOperation({ summary: 'Buscar usuário por ID' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }
}
