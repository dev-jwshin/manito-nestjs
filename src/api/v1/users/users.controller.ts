import { Controller, Session, HttpCode, Get } from '@nestjs/common';

@Controller('api/v1/users')
export class UsersController {
  constructor() {}

  @Get()
  async index(@Session() session: Record<string, any>) {}
}
