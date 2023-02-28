import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { User } from '../../../domain/User';
import { UserData } from './UserData';

@Injectable()
export class UserSchemaFactory implements EntitySchemaFactory<UserData, User> {
  createSchemaFromEntity(user: User): UserData {
    const { id: _id, ...rest } = user.toPrimitives();
    return { _id, ...rest };
  }
  createEntityFromSchema(schema: UserData): User {
    const { _id: id, ...rest } = schema;
    return User.fromPrimitives({ id, ...rest });
  }
}
