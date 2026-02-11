
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';

export class SignUpDTO {
  @IsEmail()
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  password: string;

  @IsString()
  @IsNotEmpty({ message: "Le username est obligatoire" })
  username: string;

  @IsString()
  @IsNotEmpty({ message: "Le rôle est obligatoire" })
  role: string;

  @IsString()
  @IsNotEmpty({ message: "La ville est obligatoire" })
  ville: string;

  @IsString()
  @IsOptional() 
  avatar: string;
}
