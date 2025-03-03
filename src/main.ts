import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/env.config';
import { SessionService } from './session/session.service';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

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

  // 세션 미들웨어 설정
  app.use(session(sessionService.getSessionOptions()));

  console.log(`애플리케이션 환경: ${configService.nodeEnv}`);
  console.log(`애플리케이션 이름: ${configService.appName || '마니또'}`);

  await app.listen(port);
  console.log(`애플리케이션이 http://localhost:${port} 에서 실행 중입니다.`);
}

void bootstrap();
