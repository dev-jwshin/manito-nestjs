import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvConfigService {
  constructor(private configService: ConfigService) {}

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  // 앱 설정
  get appName(): string | undefined {
    return this.configService.get<string>('appName');
  }

  get port(): number | undefined {
    return this.configService.get<number>('port');
  }

  // 데이터베이스 설정
  get databaseHost(): string | undefined {
    return this.configService.get<string>('database.host');
  }

  get databasePort(): number | undefined {
    return this.configService.get<number>('database.port');
  }

  get databaseUsername(): string | undefined {
    return this.configService.get<string>('database.username');
  }

  get databasePassword(): string | undefined {
    return this.configService.get<string>('database.password');
  }

  get databaseName(): string | undefined {
    return this.configService.get<string>('database.name');
  }

  // JWT 설정
  get jwtSecret(): string | undefined {
    return this.configService.get<string>('jwt.secret');
  }

  // 세션 설정
  get sessionSecret(): string | undefined {
    return this.configService.get<string>('session.secret');
  }

  get sessionMaxAge(): number | undefined {
    return this.configService.get<number>('session.maxAge');
  }

  // Redis 설정
  get redisHost(): string | undefined {
    return this.configService.get<string>('redis.host');
  }

  get redisPort(): number | undefined {
    return this.configService.get<number>('redis.port');
  }

  get redisPassword(): string | undefined {
    return this.configService.get<string>('redis.password');
  }
}
