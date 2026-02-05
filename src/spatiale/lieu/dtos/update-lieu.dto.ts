import { PartialType } from '@nestjs/mapped-types';
import { CreateLieuDto } from './create-lieu.dto';
import { IsInt, IsOptional } from 'class-validator';

export class UpdateLieuDto extends PartialType(CreateLieuDto) {
  @IsInt()
  @IsOptional()
  idLieu?: number;
  
}