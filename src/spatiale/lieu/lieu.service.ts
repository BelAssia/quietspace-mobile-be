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

    return lieu;
  }

  /**
   * Récupérer les lieux par type
   */
  async findByType(idTypeLieu: number): Promise<Lieu[]> {
    return await this.lieuRepository.find({
      where: { idTypeLieu },
      relations: ['typeLieu'],
      order: { scoreCalme: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Récupérer les lieux par niveau de calme
   */
  async findByNiveauCalme(niveauCalme: string): Promise<Lieu[]> {
    return await this.lieuRepository.find({
      where: { niveauCalme },
      relations: ['typeLieu'],
      order: { scoreCalme: 'DESC', createdAt: 'DESC' },
    });
  }

  /**
   * Rechercher des lieux dans un rayon (en mètres) autour d'un point
   * Utilise ST_DWithin pour PostGIS avec SRID 4326
   */
  async findNearby(
    longitude: number,
    latitude: number,
    radiusMeters: number = 1000,
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
        ) as distance
      FROM lieu l
      WHERE l.geom IS NOT NULL
        AND ST_DWithin(
          l.geom::geography,
          ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          $3
        )
      ORDER BY distance ASC
    `;

    return await this.lieuRepository.query(query, [longitude, latitude, radiusMeters]);
  }

  /**
   * Récupérer les N lieux les plus proches d'un point
   */
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
        ) as distance
      FROM lieu l
      WHERE l.geom IS NOT NULL
      ORDER BY l.geom::geography <-> ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
      LIMIT $3
    `;

    return await this.lieuRepository.query(query, [longitude, latitude, limit]);
  }

  /**
   * Rechercher des lieux dans une bounding box
   */
  async findInBoundingBox(
    minLongitude: number,
    minLatitude: number,
    maxLongitude: number,
    maxLatitude: number,
  ): Promise<Lieu[]> {
    const query = `
      SELECT l.*
      FROM lieu l
      WHERE l.geom IS NOT NULL
        AND ST_Within(
          l.geom,
          ST_MakeEnvelope($1, $2, $3, $4, 4326)
        )
    `;

    return await this.lieuRepository.query(query, [
      minLongitude,
      minLatitude,
      maxLongitude,
      maxLatitude,
    ]);
  }

  /**
   * Mettre à jour un lieu
   */
  async update(id: number, updateLieuDto: UpdateLieuDto): Promise<Lieu> {
    const lieu = await this.findOne(id);

    // Si les coordonnées sont modifiées, mettre à jour la géométrie
    if (updateLieuDto.longitude !== undefined && updateLieuDto.latitude !== undefined) {
      lieu.geom = {
        type: 'Point',
        coordinates: [updateLieuDto.longitude, updateLieuDto.latitude],
      };
    }

    // Mettre à jour les autres champs
    if (updateLieuDto.nomLieu !== undefined) lieu.nomLieu = updateLieuDto.nomLieu;
    if (updateLieuDto.descriptionLieu !== undefined) lieu.descriptionLieu = updateLieuDto.descriptionLieu;
    if (updateLieuDto.adresseLieu !== undefined) lieu.adresseLieu = updateLieuDto.adresseLieu;
    if (updateLieuDto.imageLieu !== undefined) lieu.imageLieu = updateLieuDto.imageLieu;
    if (updateLieuDto.idTypeLieu !== undefined) lieu.idTypeLieu = updateLieuDto.idTypeLieu;

    return await this.lieuRepository.save(lieu);
  }

  /**
   * Supprimer un lieu
   */
  async remove(id: number): Promise<void> {
    const lieu = await this.findOneWithRelations(id);

    // Vérifier s'il y a des dépendances
    const hasDependencies =
      (lieu.avis && lieu.avis.length > 0) ||
      (lieu.favoris && lieu.favoris.length > 0) ||
      (lieu.envBruitLieux && lieu.envBruitLieux.length > 0) ||
      (lieu.lieuCalmePeriodes && lieu.lieuCalmePeriodes.length > 0);

    if (hasDependencies) {
      throw new ConflictException(
        `Impossible de supprimer ce lieu car il a des dépendances (avis, favoris, etc.)`,
      );
    }

    await this.lieuRepository.remove(lieu);
  }

  /**
   * Obtenir les coordonnées d'un lieu
   */
  async getCoordinates(id: number): Promise<{ longitude: number; latitude: number }> {
    const lieu = await this.findOne(id);

    if (!lieu.geom || !lieu.geom.coordinates) {
      throw new NotFoundException(`Coordonnées non disponibles pour le lieu ${id}`);
    }

    return {
      longitude: lieu.geom.coordinates[0],
      latitude: lieu.geom.coordinates[1],
    };
  }

  /**
   * Compter le nombre d'avis pour un lieu
   */
  async countAvis(id: number): Promise<number> {
    const lieu = await this.findOneWithRelations(id);
    return lieu.avis ? lieu.avis.length : 0;
  }

  /**
   * Compter le nombre de favoris pour un lieu
   */
  async countFavoris(id: number): Promise<number> {
    const lieu = await this.findOneWithRelations(id);
    return lieu.favoris ? lieu.favoris.length : 0;
  }

  /**
   * Obtenir les statistiques d'un lieu
   */
  async getStatistics(id: number): Promise<any> {
    const lieu = await this.findOneWithRelations(id);

    return {
      idLieu: lieu.idLieu,
      nomLieu: lieu.nomLieu,
      scoreCalme: lieu.scoreCalme,
      niveauCalme: lieu.niveauCalme,
      nombreAvis: lieu.avis ? lieu.avis.length : 0,
      nombreFavoris: lieu.favoris ? lieu.favoris.length : 0,
      nombreEnvBruit: lieu.envBruitLieux ? lieu.envBruitLieux.length : 0,
      nombrePeriodes: lieu.lieuCalmePeriodes ? lieu.lieuCalmePeriodes.length : 0,
    };
  }
}