import { Nullable } from '../../../shared/domain/Nullable';
import { UserNotFoundError } from '../errors/UserNotFound';
import { GithubId } from '../GithubId';
import { GoogleId } from '../GoogleId';
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
  public async findByGoogleId(googleId: GoogleId): Promise<Nullable<User>> {
    const userFound = await this.userRepository.findByGoogleId(googleId);
    return userFound;
  }

  public async findByGithubId(githubId: GithubId): Promise<Nullable<User>> {
    const userFound = await this.userRepository.findByGithubId(githubId);
    return userFound;
  }

  public async findByEmailOrThrow(email: UserEmail): Promise<User> {
    const userFound = await this.userRepository.findByEmail(email);
    if (!userFound) {
      throw UserNotFoundError.searchedByEmail(email.value);
    }
    return userFound;
  }

  public async findByGoogleIdOrThrow(googleId: GoogleId): Promise<User> {
    const userFound = await this.userRepository.findByGoogleId(googleId);
    if (!userFound) {
      throw UserNotFoundError.searchedByGoogleId(googleId.value);
    }
    return userFound;
  }

  public async findByGithubIdOrThrow(githubId: GithubId): Promise<User> {
    const userFound = await this.userRepository.findByGithubId(githubId);
    if (!userFound) {
      throw UserNotFoundError.searchedByGithubId(githubId.value);
    }
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
      throw UserNotFoundError.searchedById(id.value);
    }
    return userFound;
  }
}
