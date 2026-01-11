import { Module } from '@nestjs/common';
import { AvisController } from './avis.controller';
import { AvisService } from './avis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avis } from './entities/avis.entity';

@Module({
   imports:[TypeOrmModule.forFeature([Avis])],
  controllers: [AvisController],
  providers: [AvisService]
})
export class AvisModule {}
