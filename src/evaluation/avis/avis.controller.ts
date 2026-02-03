import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AvisService } from './avis.service';
import { CreateAvisDto } from './dtos/Create-avis.dto';
import { UpdateAvisDto } from './dtos/Update-avis.dto';

@Controller('avis')
export class AvisController {
  constructor(private readonly avisService: AvisService) {}

  /*
   * Créer un nouvel avis
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAvisDto: CreateAvisDto) {
    return this.avisService.create(createAvisDto);
  }

  /*
   * Récupérer l'avis d'un utilisateur pour un lieu spécifique
   */
  @Get(':idUser/:idLieu')
  findOne(
    @Param('idUser', ParseIntPipe) idUser: number,
    @Param('idLieu', ParseIntPipe) idLieu: number,
  ) {
    return this.avisService.findOne(idUser, idLieu);
  }

  /*
   * Mettre à jour un avis existant
   */
  @Patch(':idUser/:idLieu')
  update(
    @Param('idUser', ParseIntPipe) idUser: number,
    @Param('idLieu', ParseIntPipe) idLieu: number,
    @Body() updateAvisDto: UpdateAvisDto,
  ) {
    return this.avisService.update(idUser, idLieu, updateAvisDto);
  }
}