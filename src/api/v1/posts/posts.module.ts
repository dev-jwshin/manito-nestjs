import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsController } from './posts.controller';
import { DynamicServiceFactory } from '../../../common/base/dynamic-service.factory';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [
    {
      provide: 'PostsService',
      inject: [getRepositoryToken(Post)],
      useFactory: repository => {
        const ServiceClass = DynamicServiceFactory.create(Post);
        return new ServiceClass(repository);
      },
    },
  ],
  exports: ['PostsService'],
})
export class PostsModule {}
