import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    create(user: Partial<User>){
        const entity= this.userRepository.create(user);
        return this.userRepository.save(entity);
    }

    findByEmail(email:string){
        return this.userRepository.findOne({where : {email}});
    }

}
