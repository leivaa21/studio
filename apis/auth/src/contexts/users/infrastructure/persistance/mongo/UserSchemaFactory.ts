import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { PossibleUserCredentialsAsPrimitives } from '../../../domain/PossibleUserCredentials';
import { User } from '../../../domain/User';
import {
  BasicCredentialsData,
  GoogleCredentialsData,
  PossibleCredentialsData,
  UserData,
} from './UserData';

@Injectable()
export class UserSchemaFactory implements EntitySchemaFactory<UserData, User> {
  createSchemaFromEntity(user: User): UserData {
    const { id: _id, credentials, ...rest } = user.toPrimitives();

    let credentialsData: PossibleCredentialsData;

    switch (user.credentials.type) {
      case 'BASIC':
        credentialsData = {
          _type: 'BASIC',
          email: (credentials as unknown as BasicCredentialsData).email,
          password: user.credentials.password.value,
        };
        break;
      case 'GOOGLE':
        credentialsData = {
          _type: 'GOOGLE',
          googleId: user.credentials.googleId.value,
          email: (credentials as unknown as GoogleCredentialsData).email,
        };
        break;
      case 'GITHUB':
        credentialsData = {
          _type: 'GITHUB',
          githubId: user.credentials.githubId.value,
        };
    }

    return {
      _id,
      credentials: credentialsData,
      ...rest,
    };
  }
  createEntityFromSchema(schema: UserData): User {
    let credentials: PossibleUserCredentialsAsPrimitives;

    switch (schema.credentials._type) {
      case 'BASIC':
        credentials = {
          type: 'BASIC',
          email: schema.credentials.email,
          password: schema.credentials.password,
        };
        break;
      case 'GOOGLE':
        credentials = {
          type: 'GOOGLE',
          googleId: schema.credentials.googleId,
          email: schema.credentials.email,
        };
        break;
      case 'GITHUB':
        credentials = {
          type: 'GITHUB',
          githubId: schema.credentials.githubId,
        };
        break;
    }

    return User.fromPrimitives({
      id: schema._id,
      nickname: schema.nickname,
      credentials,
      verified: schema.verified,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
