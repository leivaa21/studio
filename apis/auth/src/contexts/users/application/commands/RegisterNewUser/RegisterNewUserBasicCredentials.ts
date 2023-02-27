import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../../shared/application/CommandHandler';
import { EventBus } from '../../../../shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../shared/domain/EventBus/InMemoryAsyncEventBus';
import { InvalidUserException } from '../../../domain/exceptions/UserInvalid';
import { UserFinder } from '../../../domain/services/UserFinder';
import { User } from '../../../domain/User';
import { UserBasicCredentials } from '../../../domain/UserBasicCredentials';
import { UserEmail } from '../../../domain/UserEmail';
import { UserNickname } from '../../../domain/UserNickname';
import { UserPassword } from '../../../domain/UserPassword';
import { UserRepository } from '../../../domain/UserRepository';

export interface RegisterNewUserBasicCredentialsCommand {
  nickname: string;
  email: string;
  password: string;
}

@Injectable({
  dependencies: [],
})
export class RegisterNewUserBasicCredentials extends CommandHandler<RegisterNewUserBasicCredentialsCommand> {
  private readonly userFinder: UserFinder;

  constructor(
    private readonly userRepository: UserRepository,
    eventBus: EventBus
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

    const password = UserPassword.of(plainPassword);
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
    const userWithSameEmail = await this.userFinder.findByEmailOrUndefined(
      email
    );

    if (userWithSameEmail) {
      throw InvalidUserException.causeEmailIsAlreadyInUse(email.value);
    }
  }

  private async verifyNicknameIsNotAlreadyInUse(nickname: UserNickname) {
    const userWithSameNickname =
      await this.userFinder.findByNicknameOrUndefined(nickname);

    if (userWithSameNickname) {
      throw InvalidUserException.causeNicknameIsAlreadyInUse(nickname.value);
    }
  }
}
