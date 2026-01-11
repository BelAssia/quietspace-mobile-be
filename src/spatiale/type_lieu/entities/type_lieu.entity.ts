import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Lieu } from 'src/spatiale/lieu/entities/lieu.entity';
@Entity('type_lieu')
export class TypeLieu {
  @PrimaryGeneratedColumn({ name: 'id_type_lieu' })
  idTypeLieu: number;

  @Column({ type: 'varchar', length: 50 })
  typeLieu: string;

  @Column({ type: 'int', name: 'base_score'})
  baseScore: number;

  @OneToMany(() => Lieu, (lieu) => lieu.typeLieu)
  lieux: Lieu[];
}