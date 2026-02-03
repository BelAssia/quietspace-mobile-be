import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateFavorisDto {
  @IsInt()
  @IsNotEmpty({ message: "L'ID de l'utilisateur est obligatoire" })
  idUser: number;

  @IsInt()
  @IsNotEmpty({ message: "L'ID du lieu est obligatoire" })
  idLieu: number;
}