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
  createdAt: Date;
  updatedAt: Date;
}

interface UserAsPrimitives {
  id: string;
  nickname: string;
  credentials: UserBasicCredentialAsPrimitives;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot {
  private readonly _id: UserId;
  private readonly _nickname: UserNickname;
  private readonly _credentials: UserBasicCredentials;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(args: UserArgs) {
    super();
    const { id, nickname, credentials, createdAt, updatedAt } = args;
    this._id = id;
    this._nickname = nickname;
    this._credentials = credentials;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  public doBasicCredentialMatch(plainEmail: string, plainPassword: string) {
    return this._credentials.doMatch(plainEmail, plainPassword);
  }

  toPrimitives(): UserAsPrimitives {
    return {
      id: this._id.value,
      nickname: this._nickname.value,
      credentials: this._credentials.toPrimitives(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get id(): UserId {
    return this._id;
  }
  get nickname(): UserNickname {
    return this._nickname;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
