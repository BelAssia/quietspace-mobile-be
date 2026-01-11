
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Lieu } from 'src/spatiale/lieu/entities/lieu.entity';
import { ElementBruit } from 'src/spatiale/element_bruit/entities/element_bruit.entity';
@Entity('env_bruit_lieu')
export class EnvBruitLieu {
  @PrimaryColumn({ name: 'id_lieu' })
  idLieu: number;

  @PrimaryColumn({ name: 'id_elem_bruit' })
  idElemBruit: number;

  @Column({ type: 'float', nullable: true })
  distance: number;

  @ManyToOne(() => Lieu, (lieu) => lieu.envBruitLieux, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_lieu' })
  lieu: Lieu;

  @ManyToOne(() => ElementBruit, (element) => element.envBruitLieux, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'id_elem_bruit' })
  elementBruit: ElementBruit;
}