export interface AuthorizationResponse {
  user: {id: string, nickname: string};
  token: string;
}