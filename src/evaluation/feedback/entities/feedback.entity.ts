import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('feedback')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id'})
  userId: number;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'NOW()',
  })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.feedbacks, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
