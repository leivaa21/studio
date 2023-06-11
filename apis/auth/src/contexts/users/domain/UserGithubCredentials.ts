import { GithubId } from './GithubId';
import { UserNickname } from './UserNickname';

interface UserGithubCredentialsArgs {
  githubId: GithubId;
  name: UserNickname;
}

export interface UserGithubCredentialsAsPrimitives {
  type: 'GITHUB';
  githubId: number;
  name: string;
}

export class UserGithubCredentials {
  private _type: 'GITHUB';
  private _githubId: GithubId;
  private _name: UserNickname;

  constructor(args: UserGithubCredentialsArgs) {
    const { githubId, name } = args;
    this._type = 'GITHUB';
    this._githubId = githubId;
    this._name = name;
  }

  public static of(args: UserGithubCredentialsArgs): UserGithubCredentials {
    return new UserGithubCredentials(args);
  }

  public toPrimitives(): UserGithubCredentialsAsPrimitives {
    return {
      type: this._type,
      githubId: this._githubId.value,
      name: this._name.value,
    };
  }

  public doMatch(credentials: { name: UserNickname; githubId: GithubId }) {
    const doNameMatch = this._name.equals(credentials.name);
    const doGithubIdMatch = this._githubId.equals(credentials.githubId);

    return doNameMatch && doGithubIdMatch;
  }

  get type(): 'GITHUB' {
    return this._type;
  }
  get googleId(): GithubId {
    return this._githubId;
  }
  get email(): UserNickname {
    return this._name;
  }
}
