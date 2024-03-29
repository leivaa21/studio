import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../../shared/application/CommandHandler';
import { EventBus } from '../../../../shared/domain/EventBus';
import { InvalidUserError } from '../../../domain/errors/UserInvalid';
import { UserFinder } from '../../../domain/services/UserFinder';
import { User } from '../../../domain/User';
import { UserBasicCredentials } from '../../../domain/UserBasicCredentials';
import { UserEmail } from '../../../domain/UserEmail';
import { UserNickname } from '../../../domain/UserNickname';
import { UserPassword } from '../../../domain/UserPassword';
import { UserRepository } from '../../../domain/UserRepository';

export class RegisterNewUserBasicCredentialsCommand {
  public readonly nickname: string;
  public readonly email: string;
  public readonly password: string;
  constructor(args: { nickname: string; email: string; password: string }) {
    this.nickname = args.nickname;
    this.email = args.email;
    this.password = args.password;
  }
}

@Injectable({
  dependencies: [UserRepository, EventBus],
})
export class RegisterNewUserBasicCredentials extends CommandHandler<RegisterNewUserBasicCredentialsCommand> {
  private readonly userFinder: UserFinder;

  constructor(
    private readonly userRepository: UserRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.userFinder = new UserFinder(userRepository);
  }
  async execute(
    command: RegisterNewUserBasicCredentialsCommand
  ): Promise<void> {
    const {
      nickname: plainNickname,
      email: plainEmail,
      password: plainPassword,
    } = command;

    const email = UserEmail.of(plainEmail);

    await this.verifyEmailIsNotAlreadyInUse(email);

    const nickname = UserNickname.of(plainNickname);
    await this.verifyNicknameIsNotAlreadyInUse(nickname);

    const password = UserPassword.new(plainPassword);
    const basicCredentials = UserBasicCredentials.of({
      email,
      password,
    });

    const user = User.createNewWithBasicCredentials({
      nickname,
      credentials: basicCredentials,
    });

    await this.userRepository.create(user);

    super.publishAggregateRootEvents(user);

    return;
  }

  private async verifyEmailIsNotAlreadyInUse(email: UserEmail) {
    const userWithSameEmail = await this.userFinder.findByEmailOrNull(email);

    if (userWithSameEmail) {
      throw InvalidUserError.causeEmailIsAlreadyInUse(email.value);
    }
  }

  private async verifyNicknameIsNotAlreadyInUse(nickname: UserNickname) {
    const userWithSameNickname = await this.userFinder.findByNicknameOrNull(
      nickname
    );

    if (userWithSameNickname) {
      throw InvalidUserError.causeNicknameIsAlreadyInUse(nickname.value);
    }
  }
}
