export interface UserData {
  _id: string;
  nickname: string;
  credentials: {
    type: 'BASIC';
    email: string;
    password: string;
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
