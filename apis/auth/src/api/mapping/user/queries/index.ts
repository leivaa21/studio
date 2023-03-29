import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import {
  GetUserByEmailHandler,
  GetUserByEmailQuery,
} from '../../../../contexts/users/application/queries/GetUser/GetUserByEmail';
import {
  GetUserByIdHandler,
  GetUserByIdQuery,
} from '../../../../contexts/users/application/queries/GetUser/GetUserById';
import {
  SignInWithBasicCredentialsHandler,
  SignInWithBasicCredentialsQuery,
} from '../../../../contexts/users/application/queries/SignIn/SignInWithBasicCredentials';
const queryBus = DependencyContainer.get<QueryBus>(InMemoryQueryBus);

queryBus.subscribe(GetUserByEmailQuery, GetUserByEmailHandler);
queryBus.subscribe(GetUserByIdQuery, GetUserByIdHandler);
queryBus.subscribe(
  SignInWithBasicCredentialsQuery,
  SignInWithBasicCredentialsHandler
);
