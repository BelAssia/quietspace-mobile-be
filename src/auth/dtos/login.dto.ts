import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsEmail({}, { message: "L'email doit être valide" })
  @IsNotEmpty({ message: "L'email est obligatoire" })
  email: string;

  @IsString()
  @IsNotEmpty({ message: "Le mot de passe est obligatoire" })
  password: string;
}