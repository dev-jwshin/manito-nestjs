import { Controller, Get, Param, ParseIntPipe, Inject } from '@nestjs/common';
import { Post } from './post.entity';
import { AllowedFilters, AllowedIncludes, Paginate, Query } from '../../../common/query-parser';
import { DynamicEntityService } from '../../../common/base/dynamic-service.factory';

@Controller('api/v1/posts')
@AllowedFilters(['title', 'published', 'authorId'])
@AllowedIncludes(['author'])
@Paginate({ defaultPage: 1, defaultPerPage: 15, maxPerPage: 30 })
export class PostsController {
  constructor(
    @Inject('PostsService')
    private readonly postsService: DynamicEntityService<Post>,
  ) {}

  @Get()
  async index(@Query() query): Promise<Post[]> {
    const options = query.toFindManyOptions();
    return this.postsService.all(options);
  }

  @Get(':id')
  @AllowedFilters(['published']) // 함수 레벨에서 다른 필터 허용
  async show(@Param('id', ParseIntPipe) id: number, @Query() query): Promise<Post | null> {
    const options = query.toFindManyOptions();
    return this.postsService.find(id, options);
  }
}
