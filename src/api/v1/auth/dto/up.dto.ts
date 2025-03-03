import { IsEmail, IsNotEmpty, MinLength, IsString, Matches } from 'class-validator';

export class UpDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  name: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  password: string;

  @IsNotEmpty({ message: '비밀번호 확인은 필수 입력 항목입니다.' })
  passwordConfirm: string;
}
