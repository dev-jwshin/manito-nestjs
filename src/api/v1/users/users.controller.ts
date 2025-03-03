import { Controller, Get, Param, ParseIntPipe, Inject, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { AllowedFilters, AllowedIncludes, Paginate, Query } from '../../../common/query-parser';
import { DynamicEntityService } from '../../../common/base/dynamic-service.factory';
import { FindManyOptions } from 'typeorm';

@Controller('api/v1/users')
@AllowedFilters(['name', 'email', 'isActive'])
@AllowedIncludes(['posts'])
@Paginate({ defaultPage: 1, defaultPerPage: 20, maxPerPage: 50 })
export class UsersController {
  constructor(
    @Inject('UsersService')
    private readonly usersService: DynamicEntityService<User>,
  ) {}

  @Get()
  async index(@Query() query): Promise<User[]> {
    // Query 파라미터가 없을 경우 기본 옵션 사용
    const options: FindManyOptions<User> = query?.toFindManyOptions?.() || {};
    return this.usersService.all(options);
  }

  @Get(':id')
  @AllowedFilters(['isActive']) // 함수 레벨에서 다른 필터 허용
  async show(@Param('id', ParseIntPipe) id: number, @Query() query): Promise<User | null> {
    // Query 파라미터가 없을 경우 기본 옵션 사용
    const options: FindManyOptions<User> = query?.toFindManyOptions?.() || {};
    const user = await this.usersService.find(id, options);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
