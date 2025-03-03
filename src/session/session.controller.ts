import { Controller, Get, Post, Req, Res, Session } from '@nestjs/common';
import { Request, Response } from 'express';
import { EnvConfigService } from '../config/env.config';

interface SessionData {
  id?: string;
  visits?: number;
  [key: string]: any;
}

@Controller('session')
export class SessionController {
  constructor(private readonly configService: EnvConfigService) {}

  @Get()
  getSession(@Session() session: SessionData) {
    return {
      sessionId: session.id,
      visits: session.visits,
      environment: this.configService.nodeEnv,
      isProduction: this.configService.isProduction,
      sessionStore: this.configService.isProduction ? 'Redis' : 'Memory',
    };
  }

  @Post()
  setSession(@Session() session: SessionData) {
    session.visits = session.visits ? session.visits + 1 : 1;
    return { message: '세션이 업데이트되었습니다.', visits: session.visits };
  }

  @Post('clear')
  clearSession(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err: Error | null) => {
      if (err) {
        return res.status(500).json({
          message: '세션 삭제 중 오류가 발생했습니다.',
          error: err.message,
        });
      }
      return res.status(200).json({ message: '세션이 삭제되었습니다.' });
    });
  }
}
