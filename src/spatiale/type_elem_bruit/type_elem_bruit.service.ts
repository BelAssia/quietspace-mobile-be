import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeElemBruit } from './entities/type_elem_bruit.entity';

@Injectable()
export class TypeElemBruitService {
  constructor(
    @InjectRepository(TypeElemBruit)
    private readonly typeElemBruitRepository: Repository<TypeElemBruit>,
  ) {}

  /**
   * Récupérer toutes les configs de type élément bruit
   */
  async findAll(): Promise<TypeElemBruit[]> {
    return this.typeElemBruitRepository.find();
  }
 
}
