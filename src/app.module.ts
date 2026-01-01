import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:5432,
      username:'postgres',
      password:'admin1728',
      database:'QS_DbMobile',
      entities:[User],
      synchronize:true, //DEV uniquement

    }),
    AuthModule, UserModule],
})
export class AppModule {}
