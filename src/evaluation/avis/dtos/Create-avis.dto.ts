import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateAvisDto {
  @IsInt()
  @IsNotEmpty({ message: "L'ID de l'utilisateur est obligatoire" })
  idUser: number;

  @IsInt()
  @IsNotEmpty({ message: "L'ID du lieu est obligatoire" })
  idLieu: number;

  @IsInt()
  @IsNotEmpty({ message: 'La note est obligatoire' })
  @Min(1, { message: 'La note doit être au minimum 1' })
  @Max(5, { message: 'La note doit être au maximum 5' })
  note: number;
}