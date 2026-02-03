import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TypeLieuService } from './type_lieu.service';
import { CreateTypeLieuDto } from './dtos/create-type-lieu.dto';
import { UpdateTypeLieuDto } from './dtos/update-type-lieu.dto';

@Controller('type-lieu')
export class TypeLieuController {
  constructor(private readonly typeLieuService: TypeLieuService) {}

  /**
   * POST /type-lieu
   * Créer un nouveau type de lieu
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTypeLieuDto: CreateTypeLieuDto) {
    return this.typeLieuService.create(createTypeLieuDto);
  }

  /**
   * GET /type-lieu
   * Récupérer tous les types de lieu
   * CORRECTION: Cet endpoint était commenté et manquant
   */
  @Get()
  findAll() {
    return this.typeLieuService.findAll();
  }

  /**
   * GET /type-lieu/:id
   * Récupérer un type de lieu par son ID
   * Query param: withLieux (boolean) - inclure les lieux associés
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withLieux') withLieux?: string,
  ) {
    if (withLieux === 'true') {
      return this.typeLieuService.findOneWithLieux(id);
    }
    return this.typeLieuService.findOne(id);
  }

  /**
   * PATCH /type-lieu/:id
   * Mettre à jour un type de lieu
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTypeLieuDto: UpdateTypeLieuDto,
  ) {
    return this.typeLieuService.update(id, updateTypeLieuDto);
  }

  /**
   * DELETE /type-lieu/:id
   * Supprimer un type de lieu
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.typeLieuService.remove(id);
  }
}





