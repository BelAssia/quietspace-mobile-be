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
import { UpdateLieuDto } from './dtos/update-lieu.dto';

@Controller('lieu')
export class LieuController {
  constructor(private readonly lieuService: LieuService) {}

  /*
  /**
   * POST /lieu
   * Créer un nouveau lieu
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createLieuDto: CreateLieuDto) {
    return this.lieuService.create(createLieuDto);
  }

  /*
  /**
   * GET /lieu
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
  /**
   * GET /lieu/nearby
   * Rechercher des lieux à proximité d'un point
   * Query params: longitude, latitude, radius (en mètres)
   */
  @Get('nearby')
  findNearby(
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('radius', ParseIntPipe) radius: number = 1000,
  ) {
    return this.lieuService.findNearby(longitude, latitude, radius);
  }

  /**
   * GET /lieu/closest
   * Récupérer les N lieux les plus proches
   * Query params: longitude, latitude, limit
   */
  @Get('closest')
  findClosest(
    @Query('longitude', ParseFloatPipe) longitude: number,
    @Query('latitude', ParseFloatPipe) latitude: number,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.lieuService.findClosest(longitude, latitude, limit);
  }

  /**
   * GET /lieu/bounding-box
   * Rechercher des lieux dans une bounding box
   * Query params: minLng, minLat, maxLng, maxLat
   */
  @Get('bounding-box')
  findInBoundingBox(
    @Query('minLng', ParseFloatPipe) minLongitude: number,
    @Query('minLat', ParseFloatPipe) minLatitude: number,
    @Query('maxLng', ParseFloatPipe) maxLongitude: number,
    @Query('maxLat', ParseFloatPipe) maxLatitude: number,
  ) {
    return this.lieuService.findInBoundingBox(
      minLongitude,
      minLatitude,
      maxLongitude,
      maxLatitude,
    );
  }

  /**
   * GET /lieu/type/:idTypeLieu
   * Récupérer les lieux par type
   */
  @Get('type/:idTypeLieu')
  findByType(@Param('idTypeLieu', ParseIntPipe) idTypeLieu: number) {
    return this.lieuService.findByType(idTypeLieu);
  }

  /**
   * GET /lieu/niveau-calme/:niveau
   * Récupérer les lieux par niveau de calme
   */
  @Get('niveau-calme/:niveau')
  findByNiveauCalme(@Param('niveau') niveau: string) {
    return this.lieuService.findByNiveauCalme(niveau);
  }

  /**
   * GET /lieu/:id
   * Récupérer un lieu par son ID
   * Query param: withRelations (boolean) - inclure toutes les relations
   */
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('withRelations') withRelations?: string,
  ) {
    if (withRelations === 'true') {
      return this.lieuService.findOneWithRelations(id);
    }
    return this.lieuService.findOne(id);
  }

  /**
   * GET /lieu/:id/coordinates
   * Récupérer les coordonnées d'un lieu
   */
  @Get(':id/coordinates')
  getCoordinates(@Param('id', ParseIntPipe) id: number) {
    return this.lieuService.getCoordinates(id);
  }

  /**
   * GET /lieu/:id/statistics
   * Récupérer les statistiques d'un lieu
   */
  @Get(':id/statistics')
  getStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.lieuService.getStatistics(id);
  }

  /**
   * GET /lieu/:id/count-avis
   * Compter le nombre d'avis pour un lieu
   */
  @Get(':id/count-avis')
  countAvis(@Param('id', ParseIntPipe) id: number) {
    return this.lieuService.countAvis(id);
  }

  /**
   * GET /lieu/:id/count-favoris
   * Compter le nombre de favoris pour un lieu
   */
  @Get(':id/count-favoris')
  countFavoris(@Param('id', ParseIntPipe) id: number) {
    return this.lieuService.countFavoris(id);
  }

  /**
   * PATCH /lieu/:id
   * Mettre à jour un lieu
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLieuDto: UpdateLieuDto,
  ) {
    return this.lieuService.update(id, updateLieuDto);
  }

  /**
   * DELETE /lieu/:id
   * Supprimer un lieu
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.lieuService.remove(id);
  }
}
