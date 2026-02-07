import { Module } from '@nestjs/common';
import { LieuController } from './lieu.controller';
import { LieuService } from './lieu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lieu } from './entities/lieu.entity';
import { FileModule } from 'src/file/file.module';
import { CalmeModule } from '../calme/calme.module';
import { TypeLieuModule } from '../type_lieu/type_lieu.module';

@Module({
  imports:[TypeOrmModule.forFeature([Lieu]),FileModule,CalmeModule,TypeLieuModule],
  controllers: [LieuController],
  providers: [LieuService],
   exports: [LieuService],
})
export class LieuModule {}