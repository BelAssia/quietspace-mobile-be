import { Module } from '@nestjs/common';
import { FavorisController } from './favoris.controller';
import { FavorisService } from './favoris.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favoris } from './entities/favoris.entity';

@Module({
     imports:[TypeOrmModule.forFeature([Favoris])],
  controllers: [FavorisController],
  providers: [FavorisService]
})
export class FavorisModule {}
