import { DependencyContainer } from '@studio/dependency-injection';
import { QueryBus } from '../../../../contexts/shared/domain/QueryBus';
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
import {
  SignInWithGoogleCredentialsHandler,
  SignInWithGoogleCredentialsQuery,
} from '../../../../contexts/users/application/queries/SignIn/SignInWithGoogleCredentials';
import {
  SignInWithGithubCredentialsHandler,
  SignInWithGithubCredentialsQuery,
} from '../../../../contexts/users/application/queries/SignIn/SignInWithGithubCredentials';
const queryBus = DependencyContainer.get<QueryBus>(QueryBus);

queryBus.subscribe(GetUserByEmailQuery, GetUserByEmailHandler);
queryBus.subscribe(GetUserByIdQuery, GetUserByIdHandler);
queryBus.subscribe(
  SignInWithBasicCredentialsQuery,
  SignInWithBasicCredentialsHandler
);
queryBus.subscribe(
  SignInWithGoogleCredentialsQuery,
  SignInWithGoogleCredentialsHandler
);

queryBus.subscribe(
  SignInWithGithubCredentialsQuery,
  SignInWithGithubCredentialsHandler
);
