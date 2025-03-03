import { applyDecorators } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces';
import { DynamicServiceFactory, EntityType } from './dynamic-service.factory';

/**
 * 엔티티 타입에 대한 동적 서비스를 생성하는 모듈 데코레이터입니다.
 * @param entity 엔티티 클래스
 * @param serviceName 서비스 제공자 이름 (기본값: entityName + 'Service')
 */
export function CreateService<T extends EntityType>(entity: Type<T>, serviceName?: string) {
  return applyDecorators((target: any) => {
    // 엔티티 이름 추출
    const entityName = entity.name;

    // 서비스 이름 설정 (지정되지 않은 경우 엔티티 이름 + 'Service')
    const name = serviceName || `${entityName}Service`;

    // 타겟 클래스(모듈)의 providers 확장
    const originalProviders = Reflect.getMetadata('providers', target) || [];

    // 새 provider 추가
    const providers = [
      ...originalProviders,
      {
        provide: name,
        useFactory: () => {
          return new (DynamicServiceFactory.create(entity))();
        },
      },
    ];

    // 메타데이터 업데이트
    Reflect.defineMetadata('providers', providers, target);

    // 타겟 클래스(모듈)의 exports 확장
    const originalExports = Reflect.getMetadata('exports', target) || [];

    // 새 export 추가
    const exports = [...originalExports, name];

    // 메타데이터 업데이트
    Reflect.defineMetadata('exports', exports, target);

    return target;
  });
}
