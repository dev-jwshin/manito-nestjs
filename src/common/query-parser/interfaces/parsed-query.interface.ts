import { FindOptionsWhere, FindManyOptions } from 'typeorm';

export interface ParsedFilter {
  field: string;
  value: any;
}

export interface ParsedInclude {
  relation: string;
  nested?: ParsedInclude[];
}

export interface ParsedPagination {
  page: number;
  perPage: number;
  skip: number;
  take: number;
}

export interface ParsedQuery {
  filters: ParsedFilter[];
  includes: ParsedInclude[];
  pagination: ParsedPagination;

  /**
   * 파싱된 쿼리를 TypeORM의 FindManyOptions로 변환합니다.
   * @param entityType 엔티티 타입
   * @returns TypeORM FindManyOptions 객체
   */
  toFindManyOptions<T>(entityType?: new () => T): FindManyOptions<T>;

  /**
   * 파싱된 필터를 TypeORM의 FindOptionsWhere로 변환합니다.
   * @param entityType 엔티티 타입
   * @returns TypeORM FindOptionsWhere 객체
   */
  toWhere<T>(entityType?: new () => T): FindOptionsWhere<T>;
}
