import { SetMetadata } from '@nestjs/common';

export const ALLOWED_INCLUDES_KEY = 'allowed_includes';

/**
 * 컨트롤러 클래스 또는 핸들러 메서드에서 포함 가능한 관계를 지정합니다.
 * @param allowedIncludes 포함 가능한 관계 목록
 */
export const AllowedIncludes = (allowedIncludes: string[]) =>
  SetMetadata(ALLOWED_INCLUDES_KEY, allowedIncludes);
