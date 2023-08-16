import { Injectable } from '@studio/dependency-injection';
import { Nullable } from '../../../../shared/domain/Nullable';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { GoogleId } from '../../../domain/GoogleId';
import { User } from '../../../domain/User';
import { UserEmail } from '../../../domain/UserEmail';
import { UserId } from '../../../domain/UserId';
import { UserNickname } from '../../../domain/UserNickname';
import { UserRepository } from '../../../domain/UserRepository';
import { UserData } from './UserData';
import { UserModel } from './UserSchema';
import { UserSchemaFactory } from './UserSchemaFactory';
import { GithubId } from '../../../domain/GithubId';

@Injectable({ dependencies: [UserSchemaFactory] })
export class MongoUserRepository
  extends MongoRepository<UserData, User>
  implements UserRepository
{
  protected model() {
    return UserModel;
  }

  async create(user: User): Promise<void> {
    await this.persist(user.id.value, user);
  }

  async findById(id: UserId): Promise<Nullable<User>> {
    const document = await this.model().findOne<UserData>({ _id: id.value });
    if (!document) return null;
    return this.entitySchemaFactory.createEntityFromSchema(document);
  }

  async findByEmail(email: UserEmail): Promise<Nullable<User>> {
    const document = await this.model().findOne<UserData>({
      'credentials.email': email.value,
    });
    if (!document) return null;
    return this.entitySchemaFactory.createEntityFromSchema(document);
  }

  async findByGoogleId(googleId: GoogleId): Promise<Nullable<User>> {
    const document = await this.model().findOne<UserData>({
      'credentials.googleId': googleId.value,
    });
    if (!document) return null;
    return this.entitySchemaFactory.createEntityFromSchema(document);
  }

  async findByGithubId(githubId: GithubId): Promise<Nullable<User>> {
    const document = await this.model().findOne<UserData>({
      'credentials.githubId': githubId.value,
    });
    if (!document) return null;
    return this.entitySchemaFactory.createEntityFromSchema(document);
  }

  async findByNickname(nickname: UserNickname): Promise<Nullable<User>> {
    const document = await this.model().findOne<UserData>({
      nickname: nickname.value,
    });
    if (!document) return null;
    return this.entitySchemaFactory.createEntityFromSchema(document);
  }

  async update(user: User): Promise<void> {
    await this.model().findByIdAndUpdate(
      user.id.value,
      this.entitySchemaFactory.createSchemaFromEntity(user)
    );
  }
}
