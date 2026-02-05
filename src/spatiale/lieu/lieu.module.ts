import { Module } from '@nestjs/common';
import { LieuController } from './lieu.controller';
import { LieuService } from './lieu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lieu } from './entities/lieu.entity';
import { FileModule } from 'src/file/file.module';

@Module({
    imports:[TypeOrmModule.forFeature([Lieu]),FileModule],
  
  controllers: [LieuController],
  providers: [LieuService]
})
export class LieuModule {}