import { Injectable } from '@studio/dependency-injection';
import { CommandHandler } from '../../../../shared/application/CommandHandler';
import { EventBus } from '../../../../shared/domain/EventBus';
import { InMemoryAsyncEventBus } from '../../../../shared/infrastructure/EventBus/InMemoryAsyncEventBus';
import { GoogleId } from '../../../domain/GoogleId';
import { User } from '../../../domain/User';
import { UserEmail } from '../../../domain/UserEmail';
import { UserGoogleCredentials } from '../../../domain/UserGoogleCredentials';
import { UserNickname } from '../../../domain/UserNickname';
import { UserRepository } from '../../../domain/UserRepository';
import { MongoUserRepository } from '../../../infrastructure/persistance/mongo/MongoUserRepository';

export class RegisterNewUserGoogleCredentialsCommand {
  public readonly googleId: string;
  public readonly email: string;
  constructor(params: { googleId: string; email: string }) {
    this.email = params.email;
    this.googleId = params.googleId;
  }
}

@Injectable({
  dependencies: [MongoUserRepository, InMemoryAsyncEventBus],
})
export class RegisterNewUserGoogleCredentials extends CommandHandler<RegisterNewUserGoogleCredentialsCommand> {
  constructor(
    private readonly userRepository: UserRepository,
    eventBus?: EventBus
  ) {
    super(eventBus);
  }
  async execute(
    command: RegisterNewUserGoogleCredentialsCommand
  ): Promise<void> {
    const googleId = GoogleId.of(command.googleId);
    const email = UserEmail.of(command.email);

    const credentials = UserGoogleCredentials.of({
      googleId,
      email,
    });

    const user = User.createNewWithGoogleCredentials({
      nickname: UserNickname.fromEmail(email.value),
      credentials,
    });

    await this.userRepository.create(user);

    super.publishAggregateRootEvents(user);

    return;
  }
}
