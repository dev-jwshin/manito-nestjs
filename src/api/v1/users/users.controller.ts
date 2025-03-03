import { Controller, Get, Param, ParseIntPipe, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { AllowedFilters, AllowedIncludes, Paginate, Query } from '../../../common/query-parser';
import { DynamicEntityService } from '../../../common/base/dynamic-service.factory';

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
    const options = query.toFindManyOptions();
    return this.usersService.all(options);
  }

  @Get(':id')
  @AllowedFilters(['isActive']) // 함수 레벨에서 다른 필터 허용
  async show(@Param('id', ParseIntPipe) id: number, @Query() query): Promise<User | null> {
    const options = query.toFindManyOptions();
    return this.usersService.find(id, options);
  }
}
