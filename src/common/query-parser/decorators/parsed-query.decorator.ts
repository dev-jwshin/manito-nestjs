import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ParsedQuery } from '../interfaces/parsed-query.interface';

/**
 * 컨트롤러 핸들러에서 파싱된 쿼리를 추출합니다.
 */
export const Query = createParamDecorator((data: unknown, ctx: ExecutionContext): ParsedQuery => {
  const request = ctx.switchToHttp().getRequest();
  return request.parsedQuery;
});
