import {Entity, PrimaryGeneratedColumn,Column,CreateDateColumn,OneToMany} from "typeorm";
import { Avis } from "src/evaluation/avis/entities/avis.entity";
import { Feedback } from "src/evaluation/feedback/entities/feedback.entity";
import { Favoris } from "src/favoris/entities/favoris.entity";
@Entity("users")
export class User{
    @PrimaryGeneratedColumn()
    id_user:number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column()
    username: string;

    @Column({ default: 'user' })
    role:string;

    @Column()
    ville: string;

    @Column({ default: 'default_profile.jpg' })
    avatar:string;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Avis, (avis) => avis.user)
    avis: Avis[];

    @OneToMany(() => Favoris, (favoris) => favoris.user)
    favoris: Favoris[];

    @OneToMany(() => Feedback, (feedback) => feedback.user)
    feedbacks: Feedback[];

}