// src/location/location.module.ts
import { Module } from '@nestjs/common';
import { LocationGateway } from './location.gateway';
import { LieuModule } from 'src/spatiale/lieu/lieu.module';

@Module({
  imports: [LieuModule],
  providers: [LocationGateway],
})
export class LocationModule {}