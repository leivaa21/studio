import UserEmail from './UserEmail';
import UserPassword from './UserPassword';

interface UserBasicCredentialsArgs {
  type: 'BASIC';
  email: UserEmail;
  password: UserPassword;
}

class UserBasicCredentials {
  private _type: 'BASIC';
  private _email: UserEmail;
  private _password: UserPassword;

  constructor(args: UserBasicCredentialsArgs) {
    const { type, email, password } = args;
    this._type = type;
    this._email = email;
    this._password = password;
  }
}

export default UserBasicCredentials;
