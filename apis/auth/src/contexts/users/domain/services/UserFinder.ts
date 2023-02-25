import { UserNotFoundException } from '../exceptions/UserNotFound';
import { User } from '../User';
import { UserEmail } from '../UserEmail';
import { UserId } from '../UserId';
import { UserRepository } from '../UserRepository';

export class UserFinder {
  constructor(private readonly userRepository: UserRepository) {}
  public async findByEmailOrUndefined(
    email: UserEmail
  ): Promise<User | undefined> {
    const userFound = await this.userRepository.findByEmail(email);
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
