export interface RegisterUserBody {
  nickname: string;
  credentials: {
    email: string;
    password: string;
  };
}
