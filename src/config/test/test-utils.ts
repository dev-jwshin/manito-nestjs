import { FindManyOptions } from 'typeorm';
import { dataSource, app } from './jest.setup';
import * as request from 'supertest';
import { _ } from '@faker-js/faker/dist/airline-BXaRegOM';

/**
 * 테스트용 파싱된 쿼리 객체 인터페이스
 */
export interface TestParsedQuery<T = any> {
  filters: { field: string; value: any }[];
  includes: { relation: string; nested: any[] }[];
  pagination: {
    page: number;
    perPage: number;
    skip: number;
    take: number;
  };
  toFindManyOptions: () => FindManyOptions<T>;
  toWhere: () => Record<string, any>;
}

/**
 * 테스트용 파싱된 쿼리 객체 생성
 * @param options 쿼리 옵션
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createParsedQuery<T = any>(
  options: {
    filters?: { field: string; value: any }[];
    includes?: { relation: string; nested: any[] }[];
    pagination?: {
      page?: number;
      perPage?: number;
      skip?: number;
      take?: number;
    };
    where?: Record<string, any>;
    relations?: Record<string, any>;
  } = {},
): TestParsedQuery<T> {
  const filters = options.filters || [];
  const includes = options.includes || [];
  const pagination = {
    page: options.pagination?.page || 1,
    perPage: options.pagination?.perPage || 15,
    skip:
      options.pagination?.skip ||
      (options.pagination?.page
        ? (options.pagination.page - 1) * (options.pagination?.perPage || 15)
        : 0),
    take: options.pagination?.take || options.pagination?.perPage || 15,
  };

  const where = options.where || {};
  filters.forEach(filter => {
    where[filter.field] = filter.value;
  });

  const relations = options.relations || {};
  includes.forEach(include => {
    relations[include.relation] = true;
  });

  return {
    filters,
    includes,
    pagination,
    toFindManyOptions: () => ({
      where,
      relations,
      skip: pagination.skip,
      take: pagination.take,
    }),
    toWhere: () => where,
  };
}

/**
 * 필터를 적용한 쿼리 생성
 * @param field 필터 필드
 * @param value 필터 값
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createFilterQuery<T = any>(field: string, value: any): TestParsedQuery<T> {
  return createParsedQuery({
    filters: [{ field, value }],
    where: { [field]: value },
  });
}

/**
 * 관계를 포함한 쿼리 생성
 * @param relation 포함할 관계 이름
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createIncludeQuery<T = any>(relation: string): TestParsedQuery<T> {
  return createParsedQuery({
    includes: [{ relation, nested: [] }],
    relations: { [relation]: true },
  });
}

/**
 * 페이지네이션을 적용한 쿼리 생성
 * @param page 페이지 번호
 * @param perPage 페이지당 항목 수
 * @returns 테스트용 파싱된 쿼리 객체
 */
export function createPaginationQuery<T = any>(page: number, perPage: number): TestParsedQuery<T> {
  return createParsedQuery({
    pagination: {
      page,
      perPage,
      skip: (page - 1) * perPage,
      take: perPage,
    },
  });
}

/**
 * 엔티티를 데이터베이스에 저장
 * @param entityClass 엔티티 클래스
 * @param entityData 저장할 엔티티 데이터
 * @returns 저장된 엔티티
 */
export async function saveEntity<T>(entityClass: any, entityData: any): Promise<T> {
  // 외래 키 관계를 제거하고 ID만 유지
  const cleanedData = { ...entityData };

  // 관계 객체를 제거하고 ID만 유지
  for (const key in cleanedData) {
    if (cleanedData[key] && typeof cleanedData[key] === 'object' && cleanedData[key].id) {
      // 관계 객체가 있고 ID가 있는 경우, 관계 객체를 제거하고 외래 키만 유지
      const relationId = cleanedData[key].id;
      delete cleanedData[key];

      // 외래 키 필드가 있는지 확인 (예: authorId)
      const foreignKeyField = `${key}Id`;
      if (!(foreignKeyField in cleanedData)) {
        cleanedData[foreignKeyField] = relationId;
      }
    }
  }

  return await dataSource.getRepository(entityClass).save(cleanedData);
}

/**
 * 여러 엔티티를 데이터베이스에 저장
 * @param entityClass 엔티티 클래스
 * @param entitiesData 저장할 엔티티 데이터 배열
 * @returns 저장된 엔티티 배열
 */
export async function saveEntities<T>(entityClass: any, entitiesData: any[]): Promise<T[]> {
  const savedEntities: T[] = [];
  for (const entityData of entitiesData) {
    const entity = await saveEntity<T>(entityClass, entityData);
    savedEntities.push(entity);
  }
  return savedEntities;
}

/**
 * 엔티티 API 테스트
 * @param endpoint API 엔드포인트
 * @param id 엔티티 ID (없으면 목록 엔드포인트로 간주)
 * @param queryParams 쿼리 파라미터
 * @param expectedStatus 기대하는 응답 상태 코드
 * @returns 응답 객체
 */
export async function testEndpoint(
  endpoint: string,
  id?: number,
  queryParams?: Record<string, any>,
  expectedStatus = 200,
) {
  const url = id !== undefined ? `${endpoint}/${id}` : endpoint;

  return await request(app.getHttpServer())
    .get(url)
    .query(queryParams || {})
    .expect(expectedStatus);
}

/**
 * 엔티티 목록 API 테스트
 * @param endpoint API 엔드포인트
 * @param queryParams 쿼리 파라미터
 * @returns 응답 객체
 */
export async function testListEndpoint(endpoint: string, queryParams?: Record<string, any>) {
  return testEndpoint(endpoint, undefined, queryParams);
}

/**
 * 엔티티 상세 API 테스트
 * @param endpoint API 엔드포인트
 * @param id 엔티티 ID
 * @param queryParams 쿼리 파라미터
 * @returns 응답 객체
 */
export async function testDetailEndpoint(
  endpoint: string,
  id: number,
  queryParams?: Record<string, any>,
  expectedStatus = 200,
) {
  return testEndpoint(endpoint, id, queryParams, expectedStatus);
}

/**
 * 필터 쿼리 파라미터 생성
 * @param field 필터 필드
 * @param value 필터 값
 * @returns 쿼리 파라미터 객체
 */
export function createFilterQueryParams(field: string, value: any): Record<string, any> {
  return { [`filter[${field}]`]: value };
}

/**
 * 관계 포함 쿼리 파라미터 생성
 * @param relation 포함할 관계 이름
 * @returns 쿼리 파라미터 객체
 */
export function createIncludeQueryParams(relation: string): Record<string, any> {
  return { include: relation };
}

/**
 * 페이지네이션 쿼리 파라미터 생성
 * @param page 페이지 번호
 * @param perPage 페이지당 항목 수
 * @returns 쿼리 파라미터 객체
 */
export function createPaginationQueryParams(page: number, perPage: number): Record<string, any> {
  return { page, perPage };
}
