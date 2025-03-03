import { Controller, Post, Body, UseGuards, Get, Request, Session, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { SessionAuthGuard } from './guards';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto, @Session() session: Record<string, any>) {
    const user = await this.authService.login(loginDto);
    session.user = user;
    return { user };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Session() session: Record<string, any>) {
    const user = await this.authService.register(registerDto);
    session.user = user;
    return { user };
  }

  @UseGuards(SessionAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.session.user.id);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Session() session: Record<string, any>) {
    session.destroy();
    return { message: '로그아웃 되었습니다.' };
  }
}
