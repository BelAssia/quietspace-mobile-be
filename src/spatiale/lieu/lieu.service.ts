import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lieu } from './entities/lieu.entity';
import { CreateLieuDto } from './dtos/create-lieu.dto';
import { UpdateLieuDto } from './dtos/update-lieu.dto';
import { CalmeCalculatorService } from '../calme/calme-calculator.service';
import { TypeLieuService } from '../type_lieu/type_lieu.service';


@Injectable()
export class LieuService {

  constructor(
    @InjectRepository(Lieu)
    private readonly lieuRepository: Repository<Lieu>,
     private readonly calmeCalculator: CalmeCalculatorService,
      private readonly typeLieuService: TypeLieuService
  ) {}

  /**
   * Créer un nouveau lieu avec coordonnées géospatiales SRID 4326
   */
  async create(createLieuDto: CreateLieuDto): Promise<Lieu> {
    try {
      // on doit verifier si un lieu avec les meme coordonne exist deja!
      // Créer la géométrie Point avec SRID 4326 [longitude, latitude]

       // Vérifier si le type de lieu existe
    const typeLieu = await this.typeLieuService.findOne(createLieuDto.idTypeLieu );

    if (!typeLieu) {
      throw new NotFoundException(`Type de lieu avec l'ID ${createLieuDto.idTypeLieu} non trouvé`);
    }
  // score de base selon type de lieu
    const baseScore = typeLieu.baseScore;


    // calcul via Overpass
    const calmeData = await this.calmeCalculator.calculateScoreCalme(
     createLieuDto.latitude,
      createLieuDto.longitude,
      baseScore
    );

    const scoreCalmeRecupere = calmeData.scoreFinal;
    const niveauCalmeRecupere = calmeData.niveauCalme;

      const lieu = this.lieuRepository.create({
        idTypeLieu: createLieuDto.idTypeLieu,
        nomLieu: createLieuDto.nomLieu,
        descriptionLieu: createLieuDto.descriptionLieu,
        adresseLieu: createLieuDto.adresseLieu,
        imageLieu: createLieuDto.imageLieu,
        geom: {
          type: 'Point',
          coordinates: [createLieuDto.longitude, createLieuDto.latitude],
        },
        // Valeurs par défaut (seront calculées dans le prochain sprint)
        scoreCalme: scoreCalmeRecupere,
        niveauCalme: niveauCalmeRecupere,
      });

      return await this.lieuRepository.save(lieu);
    } catch (error) {
    throw new BadRequestException('Erreur lors de la création du lieu: ' + error.message);
  }
  }

  /**
   * Récupérer tous les lieux
   */
  async findAll(): Promise<Lieu[]> {
    return await this.lieuRepository.find({
      relations: ['typeLieu'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupérer tous les lieux avec toutes leurs relations
   */
  async findAllWithRelations(): Promise<Lieu[]> {
    return await this.lieuRepository.find({
      relations: ['typeLieu', 'avis', 'favoris', 'envBruitLieux', 'lieuCalmePeriodes'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Récupérer un lieu par son ID
   */
  async findOne(id: number): Promise<Lieu> {
    const lieu = await this.lieuRepository.findOne({
      where: { idLieu: id },
      relations: ['typeLieu'],
    });

    if (!lieu) {
      throw new NotFoundException(`Lieu avec l'ID ${id} non trouvé`);
    }

    console.log("Lieu chargé (sans toutes relations) →", {
    id: lieu.idLieu,
    nom: lieu.nomLieu,
    scoreCalme: lieu.scoreCalme,
    typeLieu: lieu.typeLieu ? { id: lieu.typeLieu.idTypeLieu, nom: lieu.typeLieu.typeLieu } : "ABSENT"
  });

    return lieu;
  }


/**
   * Récupérer un lieu par son ID avec toutes ses relations + note moyenne
   */
  async findOneWithRelations(id: number): Promise<Lieu> {
    const lieu = await this.lieuRepository.findOne({
      where: { idLieu: id },
      relations: ['typeLieu', 'avis', 'favoris', 'envBruitLieux', 'lieuCalmePeriodes'],
    });

    if (!lieu) {
      throw new NotFoundException(`Lieu avec l'ID ${id} non trouvé`);
    }

    // Calculer la note moyenne des avis
    if (lieu.avis && lieu.avis.length > 0) {
      const sommeNotes = lieu.avis.reduce((sum, avis) => sum + avis.note, 0);
      lieu['noteMoyenne'] = Number((sommeNotes / lieu.avis.length).toFixed(1));
    } else {
      lieu['noteMoyenne'] = null;
    }

    console.log("Lieu chargé (avec toutes relations) →", {
      id: lieu.idLieu,
      nom: lieu.nomLieu,
      scoreCalme: lieu.scoreCalme,
      noteMoyenne: lieu['noteMoyenne'],
      nombreAvis: lieu.avis?.length || 0,
      typeLieu: lieu.typeLieu ? { id: lieu.typeLieu.idTypeLieu, nom: lieu.typeLieu.typeLieu } : "ABSENT"
    });

    return lieu;
  }



async findClosest(
  longitude: number,
  latitude: number,
  limit: number = 10,
): Promise<any[]> {
  const query = `
    SELECT 
      l.id_lieu as "idLieu",
      l.id_type_lieu as "idTypeLieu",
      l.nom_lieu as "nomLieu",
      l.description_lieu as "descriptionLieu",
      ST_X(l.geom::geometry) as longitude,
      ST_Y(l.geom::geometry) as latitude,
      l.score_calme as "scoreCalme",
      l.niveau_calme as "niveauCalme",
      l.adresse_lieu as "adresseLieu",
      l.image_lieu as "imageLieu",
      l.created_at as "createdAt",
      l.updated_at as "updatedAt",
      ST_Distance(
        l.geom::geography,
        ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      ) as distance,
      jsonb_build_object(
        'idTypeLieu', tl.id_type_lieu,
        'typeLieu', tl."typeLieu",       
        'baseScore', tl.base_score
      ) as "typeLieu"
    FROM lieu l
    LEFT JOIN type_lieu tl ON l.id_type_lieu = tl.id_type_lieu
    WHERE l.geom IS NOT NULL
    ORDER BY l.geom::geography <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
    LIMIT $3
  `;

  return await this.lieuRepository.query(query, [longitude, latitude, limit]);
}


///////////////////////////////////////////
//////////////////////////////////////////GESTION ADMIN
//////////////////////////////////////////

/**
   * Mettre à jour un lieu
   */
  async update(id: number, updateLieuDto: UpdateLieuDto): Promise<Lieu> {
    const lieu = await this.findOne(id);

    // Mettre à jour les champs simples
    if (updateLieuDto.nomLieu !== undefined) lieu.nomLieu = updateLieuDto.nomLieu;
    if (updateLieuDto.descriptionLieu !== undefined) lieu.descriptionLieu = updateLieuDto.descriptionLieu;
    if (updateLieuDto.adresseLieu !== undefined) lieu.adresseLieu = updateLieuDto.adresseLieu;
    if (updateLieuDto.imageLieu !== undefined) lieu.imageLieu = updateLieuDto.imageLieu;
    if (updateLieuDto.idTypeLieu !== undefined) lieu.idTypeLieu = updateLieuDto.idTypeLieu;

    // Mettre à jour les coordonnées si fournies
    if (updateLieuDto.longitude !== undefined && updateLieuDto.latitude !== undefined) {
      lieu.geom = {
        type: 'Point',
        coordinates: [updateLieuDto.longitude, updateLieuDto.latitude],
      };
    }

    return await this.lieuRepository.save(lieu);
  }

/**
 * Supprimer un lieu
 */
async remove(id: number): Promise<void> {
  const lieu = await this.findOne(id);
  
  // Optionnel : Vérifier si des relations existent avant de supprimer
  const lieuWithRelations = await this.lieuRepository.findOne({
    where: { idLieu: id },
    relations: ['avis', 'favoris'],
  });

  if (lieuWithRelations) {
    const relationsCount = 
      (lieuWithRelations.avis?.length || 0) + 
      (lieuWithRelations.favoris?.length || 0);
    
    if (relationsCount > 0) {
      throw new ConflictException(
        `Impossible de supprimer ce lieu car il contient ${relationsCount} relation(s) (avis/favoris)`
      );
    }
  }

  await this.lieuRepository.remove(lieu);
}
/**
 * Géocodage inverse via Nominatim (OpenStreetMap)
 */
async reverseGeocode(longitude: number, latitude: number): Promise<any> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CalmPlaceApp/1.0', // Obligatoire pour Nominatim
        },
      }
    );
    
    if (!response.ok) {
      throw new BadRequestException('Erreur lors du géocodage inverse');
    }
    
    return await response.json();
  } catch (error) {
    throw new BadRequestException('Impossible de récupérer l\'adresse: ' + error.message);
  }
}



/**
 * Recherche de lieux via Nominatim (OpenStreetMap)
 * Convertit un texte de recherche en liste de lieux avec coordonnées
 */
async searchPlaces(query: string): Promise<any[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'CalmPlaceApp/1.0',
        },
      }
    );
    
    if (!response.ok) {
      throw new BadRequestException('Erreur lors de la recherche de lieux');
    }
    
    const results = await response.json();
    
    // Formater les résultats pour faciliter l'utilisation frontend
    return results.map((place: any) => ({
      displayName: place.display_name,
      latitude: parseFloat(place.lat),
      longitude: parseFloat(place.lon),
      type: place.type,
      address: place.address,
      boundingBox: place.boundingbox, // Pour zoomer automatiquement
    }));
  } catch (error) {
    throw new BadRequestException('Impossible de rechercher des lieux: ' + error.message);
  }
}
}




