export class AuthResponseDto {
  user: {
    id: number;
    email: string;
    name: string;
  };
  message?: string;
}
