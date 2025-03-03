import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { PaginationOptions } from '../decorators/paginate.decorator';
import {
  ParsedFilter,
  ParsedInclude,
  ParsedPagination,
  ParsedQuery,
} from '../interfaces/parsed-query.interface';

@Injectable()
export class QueryParser {
  /**
   * 쿼리 파라미터를 파싱합니다.
   * @param query Express 요청의 쿼리 객체
   * @param allowedFilters 허용된 필터 필드 목록(null이면 모든 필드 허용)
   * @param allowedIncludes 허용된 관계 포함 목록(null이면 모든 관계 허용)
   * @param paginationOptions 페이지네이션 옵션
   * @returns 파싱된 쿼리 객체
   */
  parse(
    query: any,
    allowedFilters: string[] | null,
    allowedIncludes: string[] | null,
    paginationOptions: PaginationOptions,
  ): ParsedQuery {
    // filter[name] 형식의 쿼리 파라미터 처리
    const filterObj: Record<string, any> = {};

    for (const key in query) {
      const match = key.match(/^filter\[(.*?)\]$/);
      if (match && match[1]) {
        const fieldName = match[1];
        filterObj[fieldName] = query[key];
      }
    }

    const filters = this.parseFilters(filterObj, allowedFilters);
    const includes = this.parseIncludes(query.include, allowedIncludes);
    const pagination = this.parsePagination(query, paginationOptions);

    return {
      filters,
      includes,
      pagination,
      toFindManyOptions: <T>(entityType?: new () => T): FindManyOptions<T> => {
        const options: FindManyOptions<T> = {
          where: this.filtersToWhere<T>(filters),
          relations: this.includesToRelations<T>(includes),
          skip: pagination.skip,
          take: pagination.take,
        };
        return options;
      },
      toWhere: <T>(entityType?: new () => T): FindOptionsWhere<T> => {
        return this.filtersToWhere<T>(filters);
      },
    };
  }

  /**
   * 필터 파라미터를 파싱합니다.
   * @param filterObj filter 쿼리 파라미터 객체
   * @param allowedFilters 허용된 필터 필드 목록
   * @returns 파싱된 필터 배열
   */
  private parseFilters(
    filterObj: Record<string, any>,
    allowedFilters: string[] | null,
  ): ParsedFilter[] {
    const filters: ParsedFilter[] = [];

    for (const field in filterObj) {
      if (allowedFilters === null || allowedFilters.includes(field)) {
        filters.push({
          field,
          value: filterObj[field],
        });
      }
    }

    return filters;
  }

  /**
   * include 파라미터를 파싱합니다.
   * @param includeStr include 쿼리 파라미터 문자열
   * @param allowedIncludes 허용된 관계 포함 목록
   * @returns 파싱된 관계 포함 배열
   */
  private parseIncludes(
    includeStr: string | undefined,
    allowedIncludes: string[] | null,
  ): ParsedInclude[] {
    if (!includeStr) {
      return [];
    }

    const relations = includeStr.split(',');
    const includes: ParsedInclude[] = [];

    for (const relation of relations) {
      const parts = relation.trim().split('.');
      if (!parts[0]) continue;

      // 최상위 관계가 허용되지 않았으면 건너뜀
      if (allowedIncludes !== null && !allowedIncludes.includes(parts[0])) {
        continue;
      }

      // 중첩 관계 처리
      let currentLevel = includes;
      let parentInclude: ParsedInclude | null = null;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // 현재 레벨에서 이미 존재하는 관계 찾기
        let existingInclude = currentLevel.find(inc => inc.relation === part);

        if (!existingInclude) {
          existingInclude = { relation: part, nested: [] };
          currentLevel.push(existingInclude);
        }

        if (i < parts.length - 1) {
          // 다음 레벨로 이동
          parentInclude = existingInclude;
          if (!existingInclude.nested) {
            existingInclude.nested = [];
          }
          currentLevel = existingInclude.nested;
        }
      }
    }

    return includes;
  }

  /**
   * 페이지네이션 파라미터를 파싱합니다.
   * @param query Express 요청의 쿼리 객체
   * @param options 페이지네이션 옵션
   * @returns 파싱된 페이지네이션 객체
   */
  private parsePagination(query: any, options: PaginationOptions): ParsedPagination {
    const page = query.page ? parseInt(query.page, 10) : options.defaultPage || 1;

    const perPage = query.perPage
      ? Math.min(parseInt(query.perPage, 10), options.maxPerPage || 100)
      : options.defaultPerPage || 10;

    return {
      page,
      perPage,
      skip: (page - 1) * perPage,
      take: perPage,
    };
  }

  /**
   * 파싱된 필터를 TypeORM의 FindOptionsWhere 객체로 변환합니다.
   * @param filters 파싱된 필터 배열
   * @returns TypeORM FindOptionsWhere 객체
   */
  private filtersToWhere<T>(filters: ParsedFilter[]): FindOptionsWhere<T> {
    const where: Record<string, any> = {};

    for (const filter of filters) {
      // 문자열 "true" 또는 "false"를 boolean 값으로 변환
      if (filter.value === 'true' || filter.value === true) {
        where[filter.field] = true;
      } else if (filter.value === 'false' || filter.value === false) {
        where[filter.field] = false;
      } else {
        where[filter.field] = filter.value;
      }
    }

    return where as FindOptionsWhere<T>;
  }

  /**
   * 파싱된 관계 포함을 TypeORM의 FindOptionsRelations 객체로 변환합니다.
   * @param includes 파싱된 관계 포함 배열
   * @returns TypeORM FindOptionsRelations 객체
   */
  private includesToRelations<T>(includes: ParsedInclude[]): FindOptionsRelations<T> {
    const relations: Record<string, any> = {};

    for (const include of includes) {
      if (include.nested && include.nested.length > 0) {
        relations[include.relation] = this.nestedIncludesToRelations(include.nested);
      } else {
        relations[include.relation] = true;
      }
    }

    return relations as FindOptionsRelations<T>;
  }

  /**
   * 중첩된 관계 포함을 TypeORM의 관계 객체로 변환합니다.
   * @param nested 중첩된 관계 포함 배열
   * @returns 중첩된 관계 객체
   */
  private nestedIncludesToRelations(nested: ParsedInclude[]): Record<string, any> {
    const relations: Record<string, any> = {};

    for (const include of nested) {
      if (include.nested && include.nested.length > 0) {
        relations[include.relation] = this.nestedIncludesToRelations(include.nested);
      } else {
        relations[include.relation] = true;
      }
    }

    return relations;
  }
}
