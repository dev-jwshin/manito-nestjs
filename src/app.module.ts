import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { validationSchema } from './config/env.validation';
import { ConfigurationModule } from './config/config.module';
import { SessionModule } from './session/session.module';
import { EnvConfigService } from './config/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema,
    }),
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigurationModule],
      inject: [EnvConfigService],
      useFactory: (configService: EnvConfigService) => ({
        type: 'mysql',
        host: configService.databaseHost,
        port: configService.databasePort,
        username: configService.databaseUsername,
        password: configService.databasePassword,
        database: configService.databaseName,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: !configService.isProduction,
        logging: !configService.isProduction,
      }),
    }),
    SessionModule.register(),
    // 여기에 다른 모듈들을 추가하세요
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
