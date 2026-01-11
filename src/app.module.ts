import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { LieuModule } from './spatiale/lieu/lieu.module';
import { LieuCalmePeriodeModule } from './spatiale/lieu_calme_periode/lieu_calme_periode.module';
import { TypeLieuModule } from './spatiale/type_lieu/type_lieu.module';
import { TypeElemBruitModule } from './spatiale/type_elem_bruit/type_elem_bruit.module';
import { PeriodeBruitModule } from './spatiale/periode_bruit/periode_bruit.module';
import { EnvBruitLieuModule } from './spatiale/env_bruit_lieu/env_bruit_lieu.module';
import { ElementBruitService } from './spatiale/element_bruit/element_bruit.service';
import { ElementBruitController } from './spatiale/element_bruit/element_bruit.controller';
import { ElementBruitModule } from './spatiale/element_bruit/element_bruit.module';
import { AvisModule } from './evaluation/avis/avis.module';
import { FeedbackModule } from './evaluation/feedback/feedback.module';
import { FavorisModule } from './favoris/favoris.module';
import { Avis } from './evaluation/avis/entities/avis.entity';
import { Feedback } from './evaluation/feedback/entities/feedback.entity';
import { Favoris } from './favoris/entities/favoris.entity';
import { ElementBruit } from './spatiale/element_bruit/entities/element_bruit.entity';
import { EnvBruitLieu } from './spatiale/env_bruit_lieu/entities/env_bruit_lieu.entity';
import { Lieu } from './spatiale/lieu/entities/lieu.entity';
import { LieuCalmePeriode } from './spatiale/lieu_calme_periode/entities/lieu_calme_periode.entity';
import { PeriodeBruit } from './spatiale/periode_bruit/entities/periode_bruit.entity';
import { TypeElemBruit } from './spatiale/type_elem_bruit/entities/type_elem_bruit.entity';
import { TypeLieu } from './spatiale/type_lieu/entities/type_lieu.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
      entities:[User,Avis,Feedback,Favoris,ElementBruit,EnvBruitLieu,Lieu,LieuCalmePeriode,PeriodeBruit,TypeElemBruit,TypeLieu],
      synchronize: config.get('NODE_ENV') === 'development', //DEV uniquement

    }),
      }),
    AuthModule, UserModule, LieuModule, LieuCalmePeriodeModule, TypeLieuModule, TypeElemBruitModule, PeriodeBruitModule, EnvBruitLieuModule, ElementBruitModule, AvisModule, FeedbackModule, FavorisModule],
  providers: [ElementBruitService],
  controllers: [ElementBruitController],
})
export class AppModule {}
