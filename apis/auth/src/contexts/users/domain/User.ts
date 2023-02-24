import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UUID } from '../../shared/domain/valueObjects/UUID';
import {
  UserBasicCredentials,
  UserBasicCredentialAsPrimitives,
} from './UserBasicCredentials';
import { UserNickname } from './UserNickname';

interface UserArgs {
  id: UUID;
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
  private readonly _id: UUID;
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

  toPrimitives(): UserAsPrimitives {
    return {
      id: this._id.value,
      nickname: this._nickname.value,
      credentials: this._credentials.toPrimitives(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get id(): UUID {
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
