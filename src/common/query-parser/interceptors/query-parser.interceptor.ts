import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ALLOWED_FILTERS_KEY } from '../decorators/allowed-filters.decorator';
import { ALLOWED_INCLUDES_KEY } from '../decorators/allowed-includes.decorator';
import { PAGINATION_OPTIONS_KEY } from '../decorators/paginate.decorator';
import { ParsedQuery } from '../interfaces/parsed-query.interface';
import { QueryParser } from '../services/query-parser.service';

@Injectable()
export class QueryParserInterceptor implements NestInterceptor {
  private reflector: Reflector;

  constructor(
    @Optional() reflector: Reflector,
    private readonly queryParser: QueryParser,
  ) {
    this.reflector = reflector || new Reflector();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();

    // 메타데이터 가져오기
    const methodAllowedFilters = this.reflector.get<string[]>(ALLOWED_FILTERS_KEY, handler);
    const classAllowedFilters = this.reflector.get<string[]>(ALLOWED_FILTERS_KEY, controller);
    const allowedFilters = methodAllowedFilters || classAllowedFilters || null;

    const methodAllowedIncludes = this.reflector.get<string[]>(ALLOWED_INCLUDES_KEY, handler);
    const classAllowedIncludes = this.reflector.get<string[]>(ALLOWED_INCLUDES_KEY, controller);
    const allowedIncludes = methodAllowedIncludes || classAllowedIncludes || null;

    const methodPaginationOptions = this.reflector.get(PAGINATION_OPTIONS_KEY, handler);
    const classPaginationOptions = this.reflector.get(PAGINATION_OPTIONS_KEY, controller);
    const paginationOptions = methodPaginationOptions ||
      classPaginationOptions || {
        defaultPage: 1,
        defaultPerPage: 10,
        maxPerPage: 100,
      };

    // 쿼리 파싱
    const parsedQuery: ParsedQuery = this.queryParser.parse(
      request.query,
      allowedFilters,
      allowedIncludes,
      paginationOptions,
    );

    // 파싱된 쿼리를 요청 객체에 저장
    request.parsedQuery = parsedQuery;

    return next.handle();
  }
}
