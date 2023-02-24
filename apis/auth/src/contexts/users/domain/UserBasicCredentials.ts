import { UserEmail } from './UserEmail';
import { UserPassword } from './UserPassword';

interface UserBasicCredentialsArgs {
  type: 'BASIC';
  email: UserEmail;
  password: UserPassword;
}

export interface UserBasicCredentialAsPrimitives {
  type: 'BASIC';
  email: string;
  password: string;
}

export class UserBasicCredentials {
  private _type: 'BASIC';
  private _email: UserEmail;
  private _password: UserPassword;

  constructor(args: UserBasicCredentialsArgs) {
    const { type, email, password } = args;
    this._type = type;
    this._email = email;
    this._password = password;
  }

  public toPrimitives(): UserBasicCredentialAsPrimitives {
    return {
      type: this._type,
      email: this._email.value,
      password: this._password.value,
    };
  }
}

