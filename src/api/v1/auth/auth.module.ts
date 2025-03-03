import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ConfigurationModule } from '../../../config/config.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [ConfigurationModule],
  controllers: [AuthController],
  providers: [AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
