import { IsNumber, IsOptional, IsInt, Min, Max } from 'class-validator';

export class SearchNearbyDto {
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  radiusMeters?: number = 1000; // Rayon par défaut: 1km

  @IsInt()
  @IsOptional()
  @Min(1)
  limit?: number = 10;
}