import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto';

// 실제 구현에서는 사용자 서비스 주입 필요
// import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor() {} // private readonly usersService: UsersService,

  async validateUser(email: string, password: string): Promise<any> {
    // 실제 구현에서는 데이터베이스에서 사용자 조회
    // const user = await this.usersService.findByEmail(email);

    // 예시 구현 (실제 구현에서는 데이터베이스에서 사용자 조회)
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      name: '테스트 사용자',
      password: await bcrypt.hash('Password123!', 10),
    };

    const user = email === mockUser.email ? mockUser : null;

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
    }

    // 세션에 저장할 사용자 정보 반환
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const { email, name, password, passwordConfirm } = registerDto;

    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
    }

    // 실제 구현에서는 이메일 중복 확인 필요
    // const existingUser = await this.usersService.findByEmail(email);
    // if (existingUser) {
    //   throw new BadRequestException('이미 사용 중인 이메일입니다.');
    // }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 실제 구현에서는 데이터베이스에 사용자 생성
    // const newUser = await this.usersService.create({
    //   email,
    //   name,
    //   password: hashedPassword,
    // });

    // 예시 구현
    const newUser = {
      id: 1,
      email,
      name,
    };

    // 세션에 저장할 사용자 정보 반환
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  }

  async getProfile(userId: number): Promise<any> {
    // 실제 구현에서는 데이터베이스에서 사용자 조회
    // return this.usersService.findById(userId);

    // 예시 구현
    return {
      id: userId,
      email: 'test@example.com',
      name: '테스트 사용자',
    };
  }
}
