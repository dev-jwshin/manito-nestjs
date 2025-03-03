import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import { SessionService } from 'src/session/session.service';
import { QueryParser } from 'src/common/query-parser';
import { Reflector } from '@nestjs/core';
import { QueryParserInterceptor } from 'src/common/query-parser/interceptors/query-parser.interceptor';
import * as session from 'express-session';

// 전역 변수
export let app: INestApplication;
export let dataSource: DataSource;

/**
 * 테스트 모듈을 초기화합니다.
 * @returns 테스트 모듈
 */
export async function initTestModule(): Promise<TestingModule> {
  // AppModule을 기반으로 테스트 모듈을 구성합니다
  const moduleFixture = await Test.createTestingModule({
    imports: [AppModule],
  })
    // 필요한 경우 특정 서비스나 모듈을 오버라이드할 수 있습니다
    .compile();

  // 애플리케이션 생성
  app = moduleFixture.createNestApplication();
  const sessionService = app.get(SessionService);

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

  await app.init();

  // 데이터소스 가져오기
  dataSource = moduleFixture.get<DataSource>(DataSource);

  // 데이터베이스 연결 확인
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return moduleFixture;
}

/**
 * 테스트 데이터베이스의 모든 테이블 데이터를 정리합니다.
 */
export async function cleanDatabase(): Promise<void> {
  if (dataSource && dataSource.isInitialized) {
    try {
      // 외래 키 체크 비활성화
      await dataSource.query('SET FOREIGN_KEY_CHECKS = 0');

      // 모든 엔티티를 가져와서 테이블 이름 추출
      const entities = dataSource.entityMetadatas;

      // 각 테이블의 데이터 삭제
      for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.clear();
      }
    } catch (error) {
      console.error('데이터베이스 정리 중 오류 발생:', error);
    } finally {
      // 외래 키 체크 다시 활성화
      await dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }
}

/**
 * 테스트가 완료된 후 앱을 종료합니다.
 */
export async function closeTestModule(): Promise<void> {
  if (app) {
    await app.close();
  }
}

// 모든 테스트 전에 테스트 모듈 초기화
beforeAll(async () => {
  await initTestModule();
});

// 각 테스트 전에 데이터베이스 정리
beforeEach(async () => {
  await cleanDatabase();
});

// 모든 테스트가 끝난 후 앱 종료
afterAll(async () => {
  await closeTestModule();
});
