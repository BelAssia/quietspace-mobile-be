import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeLieu } from './entities/type_lieu.entity';
import { CreateTypeLieuDto } from './dtos/create-type-lieu.dto';
import { UpdateTypeLieuDto } from './dtos/update-type-lieu.dto';

@Injectable()
export class TypeLieuService {
  constructor(
    @InjectRepository(TypeLieu)
    private readonly typeLieuRepository: Repository<TypeLieu>,
  ) {}

  /**
   * Créer un nouveau type de lieu
   */
  async create(createTypeLieuDto: CreateTypeLieuDto): Promise<TypeLieu> {
    try {
      // Vérifier si le type existe déjà
      const existingType = await this.typeLieuRepository.findOne({
        where: { typeLieu: createTypeLieuDto.typeLieu },
      });

      if (existingType) {
        throw new ConflictException(`Le type de lieu "${createTypeLieuDto.typeLieu}" existe déjà`);
      }

      const typeLieu = this.typeLieuRepository.create(createTypeLieuDto);
      return await this.typeLieuRepository.save(typeLieu);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Erreur lors de la création du type de lieu');
    }
  }

  /**
   * Récupérer tous les types de lieu
   */
  async findAll(): Promise<TypeLieu[]> {
    return await this.typeLieuRepository.find({
      order: { typeLieu: 'ASC' },
    });
  }



  /**
   * Récupérer un type de lieu par son ID
   */
  async findOne(id: number): Promise<TypeLieu> {
    const typeLieu = await this.typeLieuRepository.findOne({
      where: { idTypeLieu: id },
    });

    if (!typeLieu) {
      throw new NotFoundException(`Type de lieu avec l'ID ${id} non trouvé`);
    }

    return typeLieu;
  }

  /**
   * Récupérer un type de lieu par son ID avec ses lieux associés
   */
  async findOneWithLieux(id: number): Promise<TypeLieu> {
    const typeLieu = await this.typeLieuRepository.findOne({
      where: { idTypeLieu: id },
      relations: ['lieux'],
    });

    if (!typeLieu) {
      throw new NotFoundException(`Type de lieu avec l'ID ${id} non trouvé`);
    }

    return typeLieu;
  }



  /**
   * Mettre à jour un type de lieu
   */
  async update(id: number, updateTypeLieuDto: UpdateTypeLieuDto): Promise<TypeLieu> {
    const typeLieu = await this.findOne(id);

    // Vérifier si le nouveau nom n'existe pas déjà (si le nom est modifié)
    if (updateTypeLieuDto.typeLieu && updateTypeLieuDto.typeLieu !== typeLieu.typeLieu) {
      const existingType = await this.typeLieuRepository.findOne({
        where: { typeLieu: updateTypeLieuDto.typeLieu },
      });

      if (existingType) {
        throw new ConflictException(`Le type de lieu "${updateTypeLieuDto.typeLieu}" existe déjà`);
      }
    }

    Object.assign(typeLieu, updateTypeLieuDto);
    return await this.typeLieuRepository.save(typeLieu);
  }

  /**
   * Supprimer un type de lieu
   */
  async remove(id: number): Promise<void> {
    const typeLieu = await this.findOneWithLieux(id);

    // Vérifier si des lieux sont associés à ce type
    if (typeLieu.lieux && typeLieu.lieux.length > 0) {
      throw new ConflictException(
        `Impossible de supprimer ce type de lieu car ${typeLieu.lieux.length} lieu(x) y sont associé(s)`,
      );
    }

    await this.typeLieuRepository.remove(typeLieu);
  }


}



















//   /**
//    * Récupérer tous les types de lieu avec leurs lieux associés
//    */
//   async findAllWithLieux(): Promise<TypeLieu[]> {
//     return await this.typeLieuRepository.find({
//       relations: ['lieux'],
//       order: { typeLieu: 'ASC' },
//     });
//   }


//     /**
//    * Récupérer un type de lieu par son nom
//    */
//   async findByTypeName(typeLieu: string): Promise<TypeLieu> {
//     const type = await this.typeLieuRepository.findOne({
//       where: { typeLieu },
//     });

//     if (!type) {
//       throw new NotFoundException(`Type de lieu "${typeLieu}" non trouvé`);
//     }

//     return type;
//   }

//   /**
//    * Compter le nombre de lieux par type
//    */
//   async countLieuxByType(id: number): Promise<number> {
//     const typeLieu = await this.findOneWithLieux(id);
//     return typeLieu.lieux ? typeLieu.lieux.length : 0;
//   }

//   /**
//    * Récupérer les statistiques des types de lieu
//    */
//   async getStatistics(): Promise<{ typeLieu: string; baseScore: number; nombreLieux: number }[]> {
//     const typesLieux = await this.findAllWithLieux();
    
//     return typesLieux.map(type => ({
//       typeLieu: type.typeLieu,
//       baseScore: type.baseScore,
//       nombreLieux: type.lieux ? type.lieux.length : 0,
//     }));
//   }