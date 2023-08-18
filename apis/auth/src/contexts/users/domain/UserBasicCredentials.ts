import { UserEmail } from './UserEmail';
import { UserPassword } from './UserPassword';

interface UserBasicCredentialsArgs {
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
    const { email, password } = args;
    this._type = 'BASIC';
    this._email = email;
    this._password = password;
  }

  public static of(args: UserBasicCredentialsArgs): UserBasicCredentials {
    return new UserBasicCredentials(args);
  }

  public toPrimitives(): UserBasicCredentialAsPrimitives {
    return {
      type: this._type,
      email: this._email.value,
      password: this._password.value,
    };
  }

  public doMatch(email: string, password: string) {
    const receivedEmail = new UserEmail(email);
    const doEmailMatch = this._email.equals(receivedEmail);
    const doPasswordMatch = this._password.doMatch(password);

    return doEmailMatch && doPasswordMatch;
  }

  get type(): 'BASIC' {
    return this._type;
  }
  get email(): UserEmail {
    return this._email;
  }
  get password(): UserPassword {
    return this._password;
  }

  public changeEmail(email: UserEmail) {
    this._email = email;
  }
}
