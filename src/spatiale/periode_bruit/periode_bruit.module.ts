import { Module } from '@nestjs/common';
import { PeriodeBruitController } from './periode_bruit.controller';
import { PeriodeBruitService } from './periode_bruit.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodeBruit } from './entities/periode_bruit.entity';

@Module({
     imports:[TypeOrmModule.forFeature([PeriodeBruit])],
  
  controllers: [PeriodeBruitController],
  providers: [PeriodeBruitService]
})
export class PeriodeBruitModule {}
