import { AggregateRoot } from '../../shared/domain/AggregateRoot';
import { Nullable } from '../../shared/domain/Nullable';
import { InvalidCredentialsError } from './errors/InvalidCredentials';
import { UnableToChangeEmail } from './errors/UnableToChangeEmail';
import { UnableToChangePassword } from './errors/UnableToChangePassword';
import { InvalidUserError } from './errors/UserInvalid';
import { UserWasCreatedEvent } from './events/UserWasCreated';
import { UserWasDeletedEvent } from './events/UserWasDeleted';
import { GithubId } from './GithubId';
import { GoogleId } from './GoogleId';
import {
  PossibleUserCredentials,
  PossibleUserCredentialsAsPrimitives,
} from './PossibleUserCredentials';
import { UserBasicCredentials } from './UserBasicCredentials';
import { UserEmail } from './UserEmail';
import { UserGithubCredentials } from './UserGithubCredentials';
import { UserGoogleCredentials } from './UserGoogleCredentials';
import { UserId } from './UserId';
import { UserNickname } from './UserNickname';
import { UserPassword } from './UserPassword';

interface UserArgs {
  id: UserId;
  nickname: UserNickname;
  credentials: PossibleUserCredentials;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserAsPrimitives {
  id: string;
  nickname: string;
  credentials: PossibleUserCredentialsAsPrimitives;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends AggregateRoot {
  private readonly _id: UserId;
  private _nickname: UserNickname;
  private readonly _credentials: PossibleUserCredentials;
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

  public static createNewWithGoogleCredentials(args: {
    nickname: UserNickname;
    credentials: UserGoogleCredentials;
  }) {
    const { nickname, credentials } = args;
    const userId = UserId.random();

    const userWasCreatedEvent = UserWasCreatedEvent.fromPrimitives({
      aggregateId: userId.value,
      attributes: {
        credentialsType: 'GOOGLE',
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

  public static createNewWithGithubCredentials(args: {
    nickname: UserNickname;
    credentials: UserGithubCredentials;
  }) {
    const { nickname, credentials } = args;
    const userId = UserId.random();

    const userWasCreatedEvent = UserWasCreatedEvent.fromPrimitives({
      aggregateId: userId.value,
      attributes: {
        credentialsType: 'GITHUB',
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
    if (this._credentials.type !== 'BASIC') {
      return false;
    }
    return this._credentials.doMatch(plainEmail, plainPassword);
  }

  public doGoogleCredentialMatch(credentials: {
    email: UserEmail;
    googleId: GoogleId;
  }) {
    if (this._credentials.type !== 'GOOGLE') {
      return false;
    }
    return this._credentials.doMatch(credentials);
  }

  public doGithubCredentialMatch(credentials: { githubId: GithubId }) {
    if (this._credentials.type !== 'GITHUB') {
      return false;
    }
    return this._credentials.doMatch(credentials);
  }

  get canBeRenamed(): boolean {
    return this.credentials.type !== 'GITHUB';
  }

  public rename(nickname: UserNickname) {
    this._nickname = nickname;
    this._updatedAt = new Date();
  }

  get canChangeEmail(): boolean {
    return this.credentials.type === 'BASIC';
  }

  public changeEmail(email: UserEmail) {
    if (this._credentials.type !== 'BASIC') {
      throw UnableToChangeEmail.causeHasWrongCredentialType(
        this.id.value,
        this.credentials.type
      );
    }
    this._credentials.changeEmail(email);
    this._updatedAt = new Date();
  }

  public changePassword(oldPassword: string, newPassword: string) {
    if (this.credentials.type !== 'BASIC') {
      throw UnableToChangePassword.causeHasWrongCredentialType(
        this.id.value,
        this.credentials.type
      );
    }

    if (!this.credentials.doPasswordMatch(oldPassword)) {
      throw InvalidCredentialsError.causePasswordDoNotMatch();
    }

    const password = UserPassword.new(newPassword);

    this.credentials.changePassword(password);
    this._updatedAt = new Date();
  }

  public static fromPrimitives(args: UserAsPrimitives) {
    let credentials: PossibleUserCredentials;

    switch (args.credentials.type) {
      case 'BASIC':
        credentials = UserBasicCredentials.of({
          email: UserEmail.of(args.credentials.email),
          password: UserPassword.of(args.credentials.password),
        });
        break;
      case 'GOOGLE':
        credentials = UserGoogleCredentials.of({
          googleId: GoogleId.of(args.credentials.googleId),
          email: UserEmail.of(args.credentials.email),
        });
        break;

      case 'GITHUB':
        credentials = UserGithubCredentials.of({
          githubId: GithubId.of(args.credentials.githubId),
        });
        break;
      default:
        throw InvalidUserError.causeInvalidCredentialsType();
    }
    return new User({
      id: UserId.of(args.id),
      nickname:
        args.credentials.type === 'GOOGLE'
          ? UserNickname.fromEmail(args.nickname)
          : UserNickname.of(args.nickname),
      credentials,
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
  get email(): Nullable<UserEmail> {
    if (this.credentials.type === 'GITHUB') return null;

    return (this._credentials as UserBasicCredentials | UserGoogleCredentials)
      .email;
  }
  get credentials(): PossibleUserCredentials {
    return this._credentials;
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

  public delete(): void {
    const event = UserWasDeletedEvent.fromPrimitives({
      aggregateId: this.id.value,
    });
    this.commit(event);
  }
}
