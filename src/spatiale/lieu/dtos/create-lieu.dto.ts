import { IsString, IsNotEmpty, IsInt, IsNumber, IsOptional, MaxLength, Min, Max } from 'class-validator';

export class CreateLieuDto {

  @IsInt()
  @IsNotEmpty({ message: "L'ID du type de lieu est obligatoire" })
  idTypeLieu: number;

  @IsString()
  @IsOptional()
  @MaxLength(100, { message: 'Le nom du lieu ne peut pas dépasser 100 caractères' })
  nomLieu?: string;

  @IsString()
  @IsOptional()
  descriptionLieu?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'La longitude est obligatoire' })
  @Min(-180, { message: 'La longitude doit être entre -180 et 180' })
  @Max(180, { message: 'La longitude doit être entre -180 et 180' })
  longitude: number;

  @IsNumber()
  @IsNotEmpty({ message: 'La latitude est obligatoire' })
  @Min(-90, { message: 'La latitude doit être entre -90 et 90' })
  @Max(90, { message: 'La latitude doit être entre -90 et 90' })
  latitude: number;

  @IsString()
  @IsOptional()
  adresseLieu?: string;

  @IsString()
  @IsOptional()
  @MaxLength(256, { message: "L'URL de l'image ne peut pas dépasser 256 caractères" })
  imageLieu?: string;
}