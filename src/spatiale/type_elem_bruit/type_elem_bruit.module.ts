import { Module } from '@nestjs/common';
import { TypeElemBruitController } from './type_elem_bruit.controller';
import { TypeElemBruitService } from './type_elem_bruit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeElemBruit } from './entities/type_elem_bruit.entity';

@Module({
     imports:[TypeOrmModule.forFeature([TypeElemBruit])],
  
  controllers: [TypeElemBruitController],
  providers: [TypeElemBruitService]
})
export class TypeElemBruitModule {}
