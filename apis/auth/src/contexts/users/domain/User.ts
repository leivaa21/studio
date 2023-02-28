import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { UserWasCreatedEvent } from './events/UserWasCreated';
import {
  UserBasicCredentials,
  UserBasicCredentialAsPrimitives,
} from './UserBasicCredentials';
import { UserEmail } from './UserEmail';
import { UserId } from './UserId';
import { UserNickname } from './UserNickname';
import { UserPassword } from './UserPassword';

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

  public constructor(args: UserArgs) {
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
    const userId = UserId.random();

    const userWasCreatedEvent = UserWasCreatedEvent.fromPrimitives({
      aggregateId: userId.value,
      attributes: {
        credentialsType: 'BASIC',
      },
    });

    const user = new User({
      id: userId,
      nickname,
      credentials,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    user.commit(userWasCreatedEvent);

    return user;
  }

  public doBasicCredentialMatch(plainEmail: string, plainPassword: string) {
    return this._credentials.doMatch(plainEmail, plainPassword);
  }

  public static fromPrimitives(args: UserAsPrimitives) {
    return new User({
      id: UserId.of(args.id),
      nickname: UserNickname.of(args.nickname),
      credentials: UserBasicCredentials.of({
        email: UserEmail.of(args.credentials.email),
        password: UserPassword.of(args.credentials.password),
      }),
      verified: args.verified,
      createdAt: args.createdAt,
      updatedAt: args.updatedAt,
    });
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
  get email(): UserEmail {
    return this._credentials.email;
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
