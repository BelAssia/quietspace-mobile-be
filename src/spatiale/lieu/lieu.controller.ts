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
  ParseFloatPipe,
} from '@nestjs/common';
import { LieuService } from './lieu.service';
import { CreateLieuDto } from './dtos/create-lieu.dto';

@Controller('lieu')
export class LieuController {
  constructor(private readonly lieuService: LieuService) {}

  /*
   * Créer un nouveau lieu
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLieuDto: CreateLieuDto) {
    return this.lieuService.create(createLieuDto);
  }

  /*
   * Récupérer tous les lieux
   * Query param: withRelations (boolean) - inclure toutes les relations
   */
  @Get()
  findAll(@Query('withRelations') withRelations?: string) {
    if (withRelations === 'true') {
      return this.lieuService.findAllWithRelations();
    }
    return this.lieuService.findAll();
  }

 
  /*
   * Récupérer les N lieux les plus proches
   */
  @Get('closest')
  findClosest(
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.lieuService.findClosest(longitude, latitude, limit);
  }



  /*
   * Récupérer un lieu par son ID
   * Query param: withRelations (boolean) - inclure toutes les relations
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withRelations') withRelations?: string,
  ) {
    console.log(`→ GET /lieu/${id}  withRelations=${withRelations}`); //ajouté 
    if (withRelations === 'true') {
      return this.lieuService.findOneWithRelations(id);
    }
    return this.lieuService.findOne(id);
  }

}
