import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/env.validation';
import { ConfigurationModule } from './config/config.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema,
    }),
    ConfigurationModule,
    SessionModule.register(),
    // 여기에 다른 모듈들을 추가하세요 (TypeOrmModule 등)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
