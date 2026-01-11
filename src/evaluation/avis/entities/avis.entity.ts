import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Lieu } from 'src/spatiale/lieu/entities/lieu.entity';

@Entity('avis')
export class Avis {
  @PrimaryColumn({ name: 'id_user' })
  idUser: number;

  @PrimaryColumn({ name: 'id_lieu' })
  idLieu: number;

  @Column({ type: 'int'})
  note: number;

  @ManyToOne(() => User, (user) => user.avis, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => Lieu, (lieu) => lieu.avis, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_lieu' })
  lieu: Lieu;
}
