export interface UserData {
  _id: string;
  nickname: string;
  credentials: PossibleCredentialsData;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BasicCredentialsData {
  _type: 'BASIC';
  email: string;
  password: string;
}

export interface GoogleCredentialsData {
  _type: 'GOOGLE';
  googleId: string;
  email: string;
}

export type PossibleCredentialsData =
  | BasicCredentialsData
  | GoogleCredentialsData;
