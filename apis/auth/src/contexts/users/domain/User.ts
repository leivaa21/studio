import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UUID } from '../../shared/domain/valueObjects/UUID';
import UserBasicCredentials from './UserBasicCredentials';
import UserNickname from './UserNickname';

interface UserArgs {
  id: UUID;
  nickname: UserNickname;
  credentials: UserBasicCredentials;
  createdAt: Date;
  updatedAt: Date;
}

class User extends AggregateRoot {
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

  toPrimitives(): void {
    throw new Error('Method not implemented.');
  }
}

export default User;
