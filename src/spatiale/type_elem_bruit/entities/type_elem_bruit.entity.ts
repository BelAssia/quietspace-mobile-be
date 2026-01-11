import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ElementBruit } from 'src/spatiale/element_bruit/entities/element_bruit.entity';
import { PeriodeBruit } from 'src/spatiale/periode_bruit/entities/periode_bruit.entity';

@Entity('type_elem_bruit')
export class TypeElemBruit {
  @PrimaryGeneratedColumn({ name: 'id_type_elem_bruit' })
  idTypeElemBruit: number;

  @Column({ type: 'varchar', length: 50, name: 'type_elem_bruit'})
  typeElemBruit: string;

  @Column({ type: 'float'})
  poids: number;

  @Column({ type: 'float', name: 'd_half' })
  dHalf: number;

  @OneToMany(() => ElementBruit, (element) => element.typeElemBruit)
  elementsBruit: ElementBruit[];

  @OneToMany(() => PeriodeBruit, (periode) => periode.typeElemBruit)
  periodesBruit: PeriodeBruit[];
}