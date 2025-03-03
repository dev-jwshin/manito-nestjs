import { SetMetadata } from '@nestjs/common';

export const ALLOWED_FILTERS_KEY = 'allowed_filters';

/**
 * 컨트롤러 클래스 또는 핸들러 메서드에서 필터링 가능한 필드를 지정합니다.
 * @param allowedFilters 필터링 가능한 필드 목록
 */
export const AllowedFilters = (allowedFilters: string[]) =>
  SetMetadata(ALLOWED_FILTERS_KEY, allowedFilters);
