import { Module, DynamicModule } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({})
export class SessionModule {
  static register(): DynamicModule {
    return {
      module: SessionModule,
      controllers: [SessionController],
      providers: [SessionService],
      exports: [SessionService],
    };
  }
}
