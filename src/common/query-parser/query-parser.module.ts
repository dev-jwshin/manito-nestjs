import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { QueryParserInterceptor } from './interceptors/query-parser.interceptor';
import { QueryParser } from './services/query-parser.service';

@Module({
  providers: [
    QueryParser,
    {
      provide: APP_INTERCEPTOR,
      useClass: QueryParserInterceptor,
    },
  ],
  exports: [QueryParser],
})
export class QueryParserModule {}
