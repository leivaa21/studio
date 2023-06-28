import { GithubId } from './GithubId';

interface UserGithubCredentialsArgs {
  githubId: GithubId;
}

export interface UserGithubCredentialsAsPrimitives {
  type: 'GITHUB';
  githubId: number;
}

export class UserGithubCredentials {
  private _type: 'GITHUB';
  private _githubId: GithubId;

  constructor(args: UserGithubCredentialsArgs) {
    const { githubId } = args;
    this._type = 'GITHUB';
    this._githubId = githubId;
  }

  public static of(args: UserGithubCredentialsArgs): UserGithubCredentials {
    return new UserGithubCredentials(args);
  }

  public toPrimitives(): UserGithubCredentialsAsPrimitives {
    return {
      type: this._type,
      githubId: this._githubId.value,
    };
  }

  public doMatch(credentials: { githubId: GithubId }) {
    return this._githubId.equals(credentials.githubId);
  }

  get type(): 'GITHUB' {
    return this._type;
  }
  get githubId(): GithubId {
    return this._githubId;
  }
}
