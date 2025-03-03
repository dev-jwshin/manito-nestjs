import { Injectable } from '@nestjs/common';
import { EnvConfigService } from '../config/env.config';
import * as session from 'express-session';
import { Redis } from 'ioredis';
import { RedisStore } from 'connect-redis';

@Injectable()
export class SessionService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly configService: EnvConfigService) {}

  /**
   * 환경에 따라 적절한 세션 스토어를 설정합니다.
   * - 개발/테스트 환경: 메모리 스토어
   * - 운영 환경: Redis 스토어
   */
  getSessionOptions(): session.SessionOptions {
    const isProduction = this.configService.isProduction;
    const sessionOptions: session.SessionOptions = {
      secret: this.configService.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: this.configService.sessionMaxAge,
        httpOnly: true,
        secure: isProduction, // HTTPS를 사용하는 경우에만 true로 설정
      },
    };

    if (isProduction) {
      try {
        // 운영 환경에서는 Redis 스토어 사용
        const redisClient = new Redis({
          host: this.configService.redisHost,
          port: this.configService.redisPort,
          password: this.configService.redisPassword || undefined,
        });

        redisClient.on('error', err => {
          console.error('Redis 연결 오류:', err);
        });

        redisClient.on('connect', () => {
          console.log('Redis 서버에 연결되었습니다.');
        });

        sessionOptions.store = new RedisStore({ client: redisClient });
        console.log('Redis 세션 스토어가 설정되었습니다.');
      } catch (error) {
        console.error(
          'Redis 스토어 설정 중 오류 발생:',
          error instanceof Error ? error.message : String(error),
        );
        console.log('대체 메모리 스토어를 사용합니다.');
      }
    } else {
      // 개발/테스트 환경에서는 메모리 스토어 사용 (기본값)
      console.log('메모리 세션 스토어가 설정되었습니다.');
    }

    return sessionOptions;
  }
}
