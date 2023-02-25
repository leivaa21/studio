import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import {
  UserBasicCredentials,
  UserBasicCredentialAsPrimitives,
} from './UserBasicCredentials';
import { UserId } from './UserId';
import { UserNickname } from './UserNickname';

interface UserArgs {
  id: UserId;
  nickname: UserNickname;
  credentials: UserBasicCredentials;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserAsPrimitives {
  id: string;
  nickname: string;
  credentials: UserBasicCredentialAsPrimitives;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot {
  private readonly _id: UserId;
  private readonly _nickname: UserNickname;
  private readonly _credentials: UserBasicCredentials;
  private _verified: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(args: UserArgs) {
    super();
    const { id, nickname, credentials, verified, createdAt, updatedAt } = args;
    this._id = id;
    this._nickname = nickname;
    this._credentials = credentials;
    this._verified = verified;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public static createNewWithBasicCredentials(args: {
    nickname: UserNickname;
    credentials: UserBasicCredentials;
  }): User {
    const { nickname, credentials } = args;
    return new User({
      id: UserId.random(),
      nickname,
      credentials,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public doBasicCredentialMatch(plainEmail: string, plainPassword: string) {
    return this._credentials.doMatch(plainEmail, plainPassword);
  }

  public toPrimitives(): UserAsPrimitives {
    return {
      id: this._id.value,
      nickname: this._nickname.value,
      credentials: this._credentials.toPrimitives(),
      verified: this._verified,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  public verify(): void {
    if (!this._verified) {
      this._verified = true;
      this._updatedAt = new Date();
    }
  }

  get id(): UserId {
    return this._id;
  }
  get nickname(): UserNickname {
    return this._nickname;
  }
  get isVerified(): boolean {
    return this._verified;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
