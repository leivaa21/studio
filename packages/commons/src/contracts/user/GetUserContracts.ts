export interface GetUserResponse {
  id: string;
  nickname: string;
}

export interface GetUserNicknameResponse {
  nickname: string;
}

interface EmailBasedCredentials {
  type: 'BASIC' | 'GOOGLE';
  email: string;
}
interface GithubCredentials {
  type: 'GITHUB'
}

type PossibleCredentialsType = EmailBasedCredentials | GithubCredentials;

export interface GetUserInfoResponse {
  id: string;
  nickname: string;
  credentials: PossibleCredentialsType;
  joinedAt: Date;
}