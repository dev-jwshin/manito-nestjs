import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigurationModule } from '../../../config/config.module';

@Module({
  imports: [ConfigurationModule],
  controllers: [AuthController],
  providers: [],
  exports: [],
})
export class AuthModule {}
