import { IsInt, IsNotEmpty, Min, Max } from 'class-validator';

export class UpdateAvisDto {
  @IsInt()
  @IsNotEmpty({ message: 'La note est obligatoire' })
  @Min(1, { message: 'La note doit être au minimum 1' })
  @Max(5, { message: 'La note doit être au maximum 5' })
  note: number;
}