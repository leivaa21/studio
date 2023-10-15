import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../shared/application/CommandHandler';
import { EventBus } from '../../../shared/domain/EventBus';
import { UserRepository } from '../../domain/UserRepository';
import { UserFinder } from '../../domain/services/UserFinder';
import { UserId } from '../../domain/UserId';
import { UserNickname } from '../../domain/UserNickname';
import { UnableToRenameUser } from '../../domain/errors/UnableToRenameUser';

export class RenameUserCommand {
  public readonly userId: string;
  public readonly nickname: string;
  constructor(params: { nickname: string; userId: string }) {
    this.userId = params.userId;
    this.nickname = params.nickname;
  }
}

@Injectable({
  dependencies: [UserRepository, EventBus],
})
export class RenameUser extends CommandHandler<RenameUserCommand> {
  private readonly userFinder: UserFinder;
  constructor(
    private readonly userRepository: UserRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
    this.userFinder = new UserFinder(userRepository);
  }
  async execute(command: RenameUserCommand): Promise<void> {
    const userId = UserId.of(command.userId);

    const user = await this.userFinder.findByIdOrThrow(userId);

    if (!user.canBeRenamed) {
      throw UnableToRenameUser.causeHasWrongCredentialType(
        user.id.value,
        user.credentials.type
      );
    }

    const nickname = UserNickname.of(command.nickname);

    user.rename(nickname);

    await this.userRepository.update(user);

    super.publishAggregateRootEvents(user);
  }
}
