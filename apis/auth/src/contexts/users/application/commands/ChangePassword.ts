import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { UserRepository } from '../../domain/UserRepository';
import { UserFinder } from '../../domain/services/UserFinder';
import { UserId } from '../../domain/UserId';
import { UnableToChangePassword } from '../../domain/errors/UnableToChangePassword';

export class ChangePasswordCommand {
  public readonly userId: string;
  public readonly password: string;
  public readonly newPassword: string;
  constructor(params: {
    userId: string;
    password: string;
    newPassword: string;
  }) {
    this.userId = params.userId;
    this.password = params.password;
    this.newPassword = params.newPassword;
  }
}

@Injectable({
  dependencies: [UserRepository, EventBus],
})
export class ChangePassword extends CommandHandler<ChangePasswordCommand> {
  private readonly userFinder: UserFinder;
  constructor(
    private readonly userRepository: UserRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.userFinder = new UserFinder(userRepository);
  }
  async execute(command: ChangePasswordCommand): Promise<void> {
    const userId = UserId.of(command.userId);

    const user = await this.userFinder.findByIdOrThrow(userId);

    if (user.credentials.type !== 'BASIC') {
      throw UnableToChangePassword.causeHasWrongCredentialType(
        user.id.value,
        user.credentials.type
      );
    }

    user.changePassword(command.password, command.newPassword);

    await this.userRepository.update(user);

    super.publishAggregateRootEvents(user);
  }
}
