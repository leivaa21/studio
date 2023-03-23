export interface SignUpRequest {
  nickname: string;
  credentials: {
    email: string;
    password: string;
  };
}
