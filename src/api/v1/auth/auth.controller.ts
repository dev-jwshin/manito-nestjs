import { Controller, Post, Body, Session, HttpCode, UseGuards } from '@nestjs/common';
import { InDto, UpDto } from './dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor() {}

  @Post('in')
  @HttpCode(200)
  async in(@Body() data: InDto, @Session() session: Record<string, any>) {}

  @Post('up')
  async up(@Body() data: UpDto, @Session() session: Record<string, any>) {}

  @Post('out')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async out(@Session() session: Record<string, any>) {}
}
