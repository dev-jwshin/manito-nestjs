import { SetMetadata } from '@nestjs/common';

export const PAGINATION_OPTIONS_KEY = 'pagination_options';

export interface PaginationOptions {
  defaultPage?: number;
  defaultPerPage?: number;
  maxPerPage?: number;
}

/**
 * 컨트롤러 클래스 또는 핸들러 메서드에서 페이지네이션 옵션을 설정합니다.
 * @param options 페이지네이션 옵션
 */
export const Paginate = (options: PaginationOptions = {}) =>
  SetMetadata(PAGINATION_OPTIONS_KEY, {
    defaultPage: options.defaultPage || 1,
    defaultPerPage: options.defaultPerPage || 10,
    maxPerPage: options.maxPerPage || 100,
  });
