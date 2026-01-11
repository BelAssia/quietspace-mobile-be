
import { Entity, PrimaryColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Lieu } from 'src/spatiale/lieu/entities/lieu.entity';

@Entity('favoris')
export class Favoris {
  @PrimaryColumn({ name: 'id_user' })
  idUser: number;

  @PrimaryColumn({ name: 'id_lieu' })
  idLieu: number;

  
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.favoris, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => Lieu, (lieu) => lieu.favoris, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_lieu' })
  lieu: Lieu;
}
