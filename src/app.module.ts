import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { LieuModule } from './spatiale/lieu/lieu.module';
import { TypeLieuModule } from './spatiale/type_lieu/type_lieu.module';
import { TypeElemBruitModule } from './spatiale/type_elem_bruit/type_elem_bruit.module';
import { AvisModule } from './evaluation/avis/avis.module';
import { FeedbackModule } from './evaluation/feedback/feedback.module';
import { FavorisModule } from './favoris/favoris.module';
import { Avis } from './evaluation/avis/entities/avis.entity';
import { Feedback } from './evaluation/feedback/entities/feedback.entity';
import { Favoris } from './favoris/entities/favoris.entity';
import { Lieu } from './spatiale/lieu/entities/lieu.entity';
import { TypeElemBruit } from './spatiale/type_elem_bruit/entities/type_elem_bruit.entity';
import { TypeLieu } from './spatiale/type_lieu/entities/type_lieu.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file/file.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
      type:'postgres',
      host: config.get<string>('DB_HOST'),
      port: config.get<number>('DB_PORT'),
      username: config.get<string>('DB_USERNAME'),
      password: config.get<string>('DB_PASSWORD'),
      database: config.get<string>('DB_NAME'),
      entities:[User,Avis,Feedback,Favoris,Lieu,TypeElemBruit,TypeLieu],
      synchronize: config.get('NODE_ENV') === 'development', //DEV uniquement

    }),
      }),
    AuthModule, UserModule, LieuModule, TypeLieuModule, TypeElemBruitModule, AvisModule, FeedbackModule, FavorisModule, FileModule, LocationModule],
 
})
export class AppModule {}
