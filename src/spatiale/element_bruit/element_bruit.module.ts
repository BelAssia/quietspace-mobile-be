import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElementBruitService } from './element_bruit.service';
import { ElementBruitController } from './element_bruit.controller';
import { ElementBruit } from './entities/element_bruit.entity';

@Module({
     imports:[TypeOrmModule.forFeature([ElementBruit])],
  controllers: [ElementBruitController],
  providers: [ElementBruitService]
})
export class ElementBruitModule {}





