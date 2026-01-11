import { Module } from '@nestjs/common';
import { EnvBruitLieuController } from './env_bruit_lieu.controller';
import { EnvBruitLieuService } from './env_bruit_lieu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvBruitLieu } from './entities/env_bruit_lieu.entity';

@Module({
   imports:[TypeOrmModule.forFeature([EnvBruitLieu])],
  controllers: [EnvBruitLieuController],
  providers: [EnvBruitLieuService]
})
export class EnvBruitLieuModule {}
