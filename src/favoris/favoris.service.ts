import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favoris } from './entities/favoris.entity';
import { CreateFavorisDto } from './dtos/Create-favoris.dto';

@Injectable()
export class FavorisService {
  constructor(
    @InjectRepository(Favoris)
    private readonly favorisRepo: Repository<Favoris>,
  ) {}

  async add(dto: CreateFavorisDto): Promise<Favoris> {
    const exists = await this.favorisRepo.findOne({
      where: { idUser: dto.idUser, idLieu: dto.idLieu },
    });
    if (exists) {
      throw new ConflictException('Ce lieu est déjà en favori');
    }
    const favoris = this.favorisRepo.create({
      idUser: dto.idUser,
      idLieu: dto.idLieu,
    });
    return this.favorisRepo.save(favoris);
  }


  async remove(idUser: number, idLieu: number): Promise<void> {
    const result = await this.favorisRepo.delete({
      idUser,
      idLieu,
    });
    if (result.affected === 0) {
      throw new NotFoundException('Favori introuvable');
    }
  }

  
  async getByUser(idUser: number): Promise<Favoris[]> {
    return this.favorisRepo.find({
      where: { idUser },
      relations: ['lieu', 'lieu.typeLieu'],
      order: { createdAt: 'DESC' },
    });
  }
}