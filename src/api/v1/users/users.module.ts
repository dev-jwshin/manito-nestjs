import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ConfigurationModule } from '../../../config/config.module';

@Module({
  imports: [ConfigurationModule],
  controllers: [UsersController],
  providers: [],
  exports: [],
})
export class UsersModule {}
