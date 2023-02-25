import { CommandHandler } from '../../../../shared/application/CommandHandler';
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

export class RegisterNewUserBasicCredentials
  implements CommandHandler<RegisterNewUserBasicCredentialsCommand>
{
  private readonly userFinder: UserFinder;
  constructor(private readonly userRepository: UserRepository) {
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

    const nickname = UserNickname.of(plainNickname);
    const email = UserEmail.of(plainEmail);
    const password = UserPassword.of(plainPassword);
    const basicCredentials = UserBasicCredentials.of({
      email,
      password,
    });

    const user = User.createNewWithBasicCredentials({
      nickname,
      credentials: basicCredentials,
    });

    const userWithSameEmail = await this.userFinder.findByEmailOrUndefined(
      email
    );

    if (userWithSameEmail) {
      throw InvalidUserException.causeEmailIsAlreadyInUse(email.value);
    }

    await this.userRepository.create(user);
    return;
  }
}
