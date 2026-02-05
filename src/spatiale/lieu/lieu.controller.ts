import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Query,
  ParseFloatPipe,
  BadRequestException,
   UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { LieuService } from './lieu.service';
import { CreateLieuDto } from './dtos/create-lieu.dto';
import { UpdateLieuDto } from './dtos/update-lieu.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';

@Controller('lieu')
export class LieuController {
  constructor(private readonly lieuService: LieuService,
      private readonly fileService: FileService,
  ) {}

  /*
   * Créer un nouveau lieu
   */
  // @Post()
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() createLieuDto: CreateLieuDto) {
  //   return this.lieuService.create(createLieuDto);
  // }

 @Post()
@HttpCode(HttpStatus.CREATED)
@UseInterceptors(FileInterceptor('image'))
async create(
  @Body() createLieuDto: CreateLieuDto,
  @UploadedFile() image?: Express.Multer.File,
) {
  // Utiliser l'image par défaut si aucune image n'est fournie
  let imageFileName = this.fileService.getDefaultImageName();
  
  // Sauvegarder l'image personnalisée si fournie
  if (image) {
    imageFileName = await this.fileService.saveImage(image);
  }

  // Assigner le nom de l'image (par défaut ou personnalisée)
  createLieuDto.imageLieu = imageFileName;

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




  /////////////////////////
  ////////////////////////GESTION ADMIN
  ////////////////////////
  /*
   * Mettre à jour un lieu avec image optionnelle
   */
@Put(':id')
@UseInterceptors(FileInterceptor('image'))
async update(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateLieuDto: UpdateLieuDto,
  @UploadedFile() image?: Express.Multer.File,
) {
  const lieu = await this.lieuService.findOne(id);
  const defaultImageName = this.fileService.getDefaultImageName();
  
  // Créer un nouvel objet pour les données de mise à jour
  const updateData: UpdateLieuDto = { ...updateLieuDto };
  
  // Gestion de l'image
  if (image) {
    // Cas 1: Nouvelle image fournie
    
    // Supprimer l'ancienne image si elle existe et n'est pas l'image par défaut
    if (lieu.imageLieu && lieu.imageLieu !== defaultImageName) {
      await this.fileService.deleteImage(lieu.imageLieu);
    }
    
    // Sauvegarder la nouvelle image
    const imageFileName = await this.fileService.saveImage(image);
    updateData.imageLieu = imageFileName;
    
  } else if (updateLieuDto.imageLieu === '' || updateLieuDto.imageLieu === undefined) {
    // Cas 2: Champ imageLieu vide ou undefined = on veut réinitialiser à l'image par défaut
    
    // Supprimer l'ancienne image si elle existe et n'est pas l'image par défaut
    if (lieu.imageLieu && lieu.imageLieu !== defaultImageName) {
      await this.fileService.deleteImage(lieu.imageLieu);
    }
    
    // Mettre l'image par défaut
    updateData.imageLieu = defaultImageName;
  }
  // Cas 3: Si imageLieu a une valeur spécifique (autre que ''), on la garde
  // Cas 4: Si imageLieu n'est pas dans updateLieuDto, on ne fait rien (garder l'image actuelle)
  
  return this.lieuService.update(id, updateData);
}

  /*
   * Supprimer un lieu et son image
   */
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async remove(@Param('id', ParseIntPipe) id: number) {
  const lieu = await this.lieuService.findOne(id);
  
  // Supprimer l'image associée seulement si ce n'est pas l'image par défaut
  if (lieu.imageLieu && lieu.imageLieu !== this.fileService.getDefaultImageName()) {
    await this.fileService.deleteImage(lieu.imageLieu);
  }

  return this.lieuService.remove(id);
}
/**
 * GET /lieu/geocode/reverse
 * Obtenir l'adresse à partir de coordonnées (via Nominatim OpenStreetMap)
 */
@Get('geocode/reverse')
async reverseGeocode(
  @Query('longitude', ParseFloatPipe) longitude: number,
  @Query('latitude', ParseFloatPipe) latitude: number,
) {
  return this.lieuService.reverseGeocode(longitude, latitude);
}


  /**
 * GET /lieu/geocode/search
 * Rechercher des lieux par nom/adresse (via Nominatim OpenStreetMap)
 */
@Get('geocode/search')
async searchPlaces(@Query('q') query: string) {
  if (!query || query.trim().length === 0) {
    throw new BadRequestException('Le paramètre de recherche "q" est requis');
  }
  return this.lieuService.searchPlaces(query);
}

}
