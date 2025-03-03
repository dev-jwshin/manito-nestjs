import { IsEmail, IsNotEmpty, MinLength, IsString, Matches } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: '유효한 이메일 주소를 입력해주세요.' })
  @IsNotEmpty({ message: '이메일은 필수 입력 항목입니다.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '이름은 필수 입력 항목입니다.' })
  name: string;

  @IsNotEmpty({ message: '비밀번호는 필수 입력 항목입니다.' })
  @MinLength(6, { message: '비밀번호는 최소 6자 이상이어야 합니다.' })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: '비밀번호는 최소 하나의 대문자, 소문자, 숫자 또는 특수 문자를 포함해야 합니다.',
  })
  password: string;

  @IsNotEmpty({ message: '비밀번호 확인은 필수 입력 항목입니다.' })
  passwordConfirm: string;
}
