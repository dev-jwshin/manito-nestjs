import { Module, Global } from '@nestjs/common';
import { EnvConfigService } from './env.config';

@Global()
@Module({
  providers: [EnvConfigService],
  exports: [EnvConfigService],
})
export class ConfigurationModule {}
