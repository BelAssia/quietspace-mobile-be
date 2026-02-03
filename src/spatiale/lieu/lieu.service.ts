import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lieu } from './entities/lieu.entity';
import { CreateLieuDto } from './dtos/create-lieu.dto';
import { UpdateLieuDto } from './dtos/update-lieu.dto';

@Injectable()
export class LieuService {
  // Valeurs par défaut pour le score et niveau de calme
  private readonly DEFAULT_SCORE_CALME = 0;
  private readonly DEFAULT_NIVEAU_CALME = 'tres_bruyant';

  constructor(
    @InjectRepository(Lieu)
    private readonly lieuRepository: Repository<Lieu>,
  ) {}

  /**
   * Créer un nouveau lieu avec coordonnées géospatiales SRID 4326
   */
  async create(createLieuDto: CreateLieuDto): Promise<Lieu> {
    try {
      // Vérifier si le lieu existe déjà
      const existingLieu = await this.lieuRepository.findOne({
        where: { idLieu: createLieuDto.idLieu },
      });

      if (existingLieu) {
        throw new ConflictException(`Le lieu avec l'ID ${createLieuDto.idLieu} existe déjà`);
      }

      // Créer la géométrie Point avec SRID 4326 [longitude, latitude]
      const lieu = this.lieuRepository.create({
        idLieu: createLieuDto.idLieu,
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
        scoreCalme: this.DEFAULT_SCORE_CALME,
        niveauCalme: this.DEFAULT_NIVEAU_CALME,
      });

      return await this.lieuRepository.save(lieu);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
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
   * Récupérer un lieu par son ID avec toutes ses relations
   */
  async findOneWithRelations(id: number): Promise<Lieu> {
    const lieu = await this.lieuRepository.findOne({
      where: { idLieu: id },
      relations: ['typeLieu', 'avis', 'favoris', 'envBruitLieux', 'lieuCalmePeriodes'],
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



async findClosest(
  longitude: number,
  latitude: number,
  limit: number = 10,
): Promise<any[]> {
  //Ajouter un JOIN avec type_lieu
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
        'typeLieu', tl.type_lieu,
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

}




