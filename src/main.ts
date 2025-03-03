import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvConfigService);
  const port = configService.port;

  console.log(`애플리케이션 환경: ${configService.nodeEnv}`);
  console.log(`애플리케이션 이름: ${configService.appName}`);
  console.log(`TEST1 값: ${configService.test1}`);
  console.log(`TEST2 값: ${configService.test2}`);

  await app.listen(port);
  console.log(`애플리케이션이 http://localhost:${port} 에서 실행 중입니다.`);
}
bootstrap();
