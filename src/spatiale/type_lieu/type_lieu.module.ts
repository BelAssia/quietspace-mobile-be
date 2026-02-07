import { Module } from '@nestjs/common';
import { TypeLieuController } from './type_lieu.controller';
import { TypeLieuService } from './type_lieu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeLieu } from './entities/type_lieu.entity';

@Module({
     imports:[TypeOrmModule.forFeature([TypeLieu])],
  
  controllers: [TypeLieuController],
  providers: [TypeLieuService],
    exports: [TypeLieuService] 
})
export class TypeLieuModule {}