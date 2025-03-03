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
  get appName(): string {
    return this.configService.get<string>('appName') || 'NestJS 애플리케이션';
  }

  get port(): number {
    return this.configService.get<number>('port') || 3000;
  }

  // 데이터베이스 설정
  get databaseHost(): string {
    return this.configService.get<string>('database.host') || 'localhost';
  }

  get databasePort(): number {
    return this.configService.get<number>('database.port') || 5432;
  }

  get databaseUsername(): string {
    return this.configService.get<string>('database.username') || 'postgres';
  }

  get databasePassword(): string {
    return this.configService.get<string>('database.password') || '';
  }

  get databaseName(): string {
    return this.configService.get<string>('database.name') || 'nestjs_db';
  }

  // JWT 설정
  get jwtSecret(): string {
    return this.configService.get<string>('jwt.secret') || 'default_secret_key';
  }

  // 세션 설정
  get sessionSecret(): string {
    return (
      this.configService.get<string>('session.secret') ||
      'default_session_secret'
    );
  }

  get sessionMaxAge(): number {
    return this.configService.get<number>('session.maxAge') || 86400000;
  }

  // Redis 설정
  get redisHost(): string {
    return this.configService.get<string>('redis.host') || 'localhost';
  }

  get redisPort(): number {
    return this.configService.get<number>('redis.port') || 6379;
  }

  get redisPassword(): string {
    return this.configService.get<string>('redis.password') || '';
  }

  // 테스트 값
  get test1(): string {
    return this.configService.get<string>('test1') || '기본값';
  }

  get test2(): string {
    return this.configService.get<string>('test2') || '기본값';
  }
}
