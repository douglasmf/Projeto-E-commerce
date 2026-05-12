import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';

import { ApiBearerAuth, ApiOperation, ApiTags} from  '@nestjs/swagger';


@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    // lista todas as categorias (público)
    @ApiOperation({ summary: 'Listar todas as categorias' })
    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    // criar nova categoria (Admin)
    @ApiOperation({ summary: 'Criar nova categoria' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Post()
    create(@Body() data: CreateCategoryDto) {
        return this.categoriesService.create(data);
    }

    // atualizar categoria (Admin)
    @ApiOperation({ summary: 'Atualizar categoria' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Patch(':id')
    update(
        @Param('id') id: string, 
        @Body() data: UpdateCategoryDto
    ) {
        return this.categoriesService.update(+id, data);
    }

    // deletar categoria (Admin)
    @ApiOperation({ summary: 'Deletar categoria' })
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles('ADMIN')
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(Number(id));
    }
}
