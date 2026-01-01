import {Entity, PrimaryGeneratedColumn,Column,CreateDateColumn} from "typeorm";
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

}