import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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


}