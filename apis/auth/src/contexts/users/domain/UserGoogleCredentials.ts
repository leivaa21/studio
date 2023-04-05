import { GoogleId } from './GoogleId';
import { UserEmail } from './UserEmail';

interface UserGoogleCredentialsArgs {
  googleId: GoogleId;
  email: UserEmail;
}

export interface UserGoogleCredentialsAsPrimitives {
  type: 'GOOGLE';
  googleId: string;
  email: string;
}

export class UserGoogleCredentials {
  private _type: 'GOOGLE';
  private _googleId: GoogleId;
  private _email: UserEmail;

  constructor(args: UserGoogleCredentialsArgs) {
    const { googleId, email } = args;
    this._type = 'GOOGLE';
    this._googleId = googleId;
    this._email = email;
  }

  public static of(args: UserGoogleCredentialsArgs): UserGoogleCredentials {
    return new UserGoogleCredentials(args);
  }

  public toPrimitives(): UserGoogleCredentialsAsPrimitives {
    return {
      type: this._type,
      googleId: this._googleId.value,
      email: this._email.value,
    };
  }

  public doMatch(credentials: { email: UserEmail; googleId: GoogleId }) {
    const doEmailMatch = this._email.equals(credentials.email);
    const doGoogleIdMatch = this._googleId.equals(credentials.googleId);

    return doEmailMatch && doGoogleIdMatch;
  }

  get type(): 'GOOGLE' {
    return this._type;
  }
  get googleId(): GoogleId {
    return this._googleId;
  }
  get email(): UserEmail {
    return this._email;
  }
}
