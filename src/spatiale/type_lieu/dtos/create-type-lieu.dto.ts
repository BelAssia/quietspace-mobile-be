import { IsString, IsNotEmpty, IsInt, Min, MaxLength } from 'class-validator';

export class CreateTypeLieuDto {
  @IsString()
  @IsNotEmpty({ message: 'Le type de lieu est obligatoire' })
  @MaxLength(50, { message: 'Le type de lieu ne peut pas dépasser 50 caractères' })
  typeLieu: string;

  @IsInt({ message: 'Le score de base doit être un nombre entier' })
  @Min(0, { message: 'Le score de base doit être positif ou nul' })
  baseScore: number;
}