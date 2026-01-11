import { Module } from '@nestjs/common';
import { LieuCalmePeriodeController } from './lieu_calme_periode.controller';
import { LieuCalmePeriodeService } from './lieu_calme_periode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LieuCalmePeriode } from './entities/lieu_calme_periode.entity';

@Module({
     imports:[TypeOrmModule.forFeature([LieuCalmePeriode])],
  
  controllers: [LieuCalmePeriodeController],
  providers: [LieuCalmePeriodeService]
})
export class LieuCalmePeriodeModule {}
