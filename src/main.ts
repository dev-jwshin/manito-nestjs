import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/env.config';
import { SessionService } from './session/session.service';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { QueryParserInterceptor } from './common/query-parser/interceptors/query-parser.interceptor';
import { QueryParser } from './common/query-parser/services/query-parser.service';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvConfigService);
  const sessionService = app.get(SessionService);
  const port = configService.port || 3000;

  // 유효성 검증 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 쿼리 파서 인터셉터 설정
  const queryParser = app.get(QueryParser);
  const reflector = new Reflector();
  app.useGlobalInterceptors(new QueryParserInterceptor(reflector, queryParser));

  // 세션 미들웨어 설정
  app.use(session(sessionService.getSessionOptions()));

  await app.listen(port);
}

void bootstrap();
