
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TypeElemBruit } from 'src/spatiale/type_elem_bruit/entities/type_elem_bruit.entity';
@Entity('periode_bruit')
export class PeriodeBruit {
  @PrimaryGeneratedColumn({ name: 'id_periode' })
  idPeriode: number;

  @Column({ name: 'id_type_elem_bruit' })
  idTypeElemBruit: number;

  @Column({ type: 'varchar', length: 50 })
  periode: string;

  @ManyToOne(() => TypeElemBruit, (type) => type.periodesBruit, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_type_elem_bruit' })
  typeElemBruit: TypeElemBruit;
}