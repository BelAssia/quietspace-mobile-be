import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lieu } from 'src/spatiale/lieu/entities/lieu.entity';
@Entity('lieu_calme_periode')
export class LieuCalmePeriode {
  @PrimaryGeneratedColumn({ name: 'id_lieu_calme_periode' })
  idLieuCalmePeriode: number;

  @Column({ name: 'id_lieu' })
  idLieu: number;

  @Column({ type: 'int', name: 'score_calme', nullable: true })
  scoreCalme: number;

  @Column({ type: 'varchar', length: 30, name: 'niveau_calme', nullable: true })
  niveauCalme: string;

  @Column({ type: 'varchar', length: 50 })
  periode: string;

  @ManyToOne(() => Lieu, (lieu) => lieu.lieuCalmePeriodes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_lieu' })
  lieu: Lieu;
}