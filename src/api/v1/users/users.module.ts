import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { DynamicServiceFactory } from '../../../common/base/dynamic-service.factory';
import { getRepositoryToken } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UsersService',
      inject: [getRepositoryToken(User)],
      useFactory: repository => {
        const ServiceClass = DynamicServiceFactory.create(User);
        return new ServiceClass(repository);
      },
    },
  ],
  exports: ['UsersService'],
})
export class UsersModule {}
