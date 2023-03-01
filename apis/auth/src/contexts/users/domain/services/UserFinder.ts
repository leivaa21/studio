import { Nullable } from '../../../shared/domain/Nullable';
import { UserNotFoundException } from '../exceptions/UserNotFound';
import { User } from '../User';
import { UserEmail } from '../UserEmail';
import { UserId } from '../UserId';
import { UserNickname } from '../UserNickname';
import { UserRepository } from '../UserRepository';

export class UserFinder {
  constructor(private readonly userRepository: UserRepository) {}
  public async findByEmailOrNull(email: UserEmail): Promise<Nullable<User>> {
    const userFound = await this.userRepository.findByEmail(email);
    return userFound;
  }
  public async findByNicknameOrNull(
    nickname: UserNickname
  ): Promise<Nullable<User>> {
    const userFound = await this.userRepository.findByNickname(nickname);
    return userFound;
  }
  public async findByIdOrThrow(id: UserId): Promise<User> {
    const userFound = await this.userRepository.findById(id);
    if (!userFound) {
      throw UserNotFoundException.searchedById(id.value);
    }
    return userFound;
  }
}
