import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avis } from './entities/avis.entity';
import { CreateAvisDto } from './dtos/Create-avis.dto';
import { UpdateAvisDto } from './dtos/Update-avis.dto';

@Injectable()
export class AvisService {
  constructor(
    @InjectRepository(Avis)
    private readonly avisRepository: Repository<Avis>,
  ) {}

  /**
   * Créer un nouvel avis
   */
  async create(createAvisDto: CreateAvisDto): Promise<Avis> {
    // Vérifier si l'utilisateur a déjà laissé un avis pour ce lieu
    const existingAvis = await this.avisRepository.findOne({
      where: {
        idUser: createAvisDto.idUser,
        idLieu: createAvisDto.idLieu,
      },
    });
    if (existingAvis) {
      throw new ConflictException(
        'Vous avez déjà laissé un avis pour ce lieu. Utilisez la mise à jour.'
      );
    }
    const avis = this.avisRepository.create(createAvisDto);
    return await this.avisRepository.save(avis);
  }


  /**
   * Récupérer l'avis d'un utilisateur pour un lieu
   */
  async findOne(idUser: number, idLieu: number): Promise<Avis> {
    const avis = await this.avisRepository.findOne({
      where: { idUser, idLieu },
      relations: ['user', 'lieu'],
    });
    if (!avis) {
      throw new NotFoundException(
        `Avis non trouvé pour l'utilisateur ${idUser} et le lieu ${idLieu}`
      );
    }
    return avis;
  }


  /**
   * Mettre à jour un avis existant
   */
  async update(
    idUser: number,
    idLieu: number,
    updateAvisDto: UpdateAvisDto,
  ): Promise<Avis> {
    const avis = await this.findOne(idUser, idLieu);
    avis.note = updateAvisDto.note;
    return await this.avisRepository.save(avis);
  }
}