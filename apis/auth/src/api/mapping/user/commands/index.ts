import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import {
  RegisterNewUserBasicCredentialsCommand,
  RegisterNewUserBasicCredentials,
} from '../../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';
import {
  RegisterNewUserGoogleCredentials,
  RegisterNewUserGoogleCredentialsCommand,
} from '../../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserGoogleCredentials';
import {
  RegisterNewUserGithubCredentials,
  RegisterNewUserGithubCredentialsCommand,
} from '../../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserGithubCredentials';

const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

commandBus.subscribe(
  RegisterNewUserBasicCredentialsCommand,
  RegisterNewUserBasicCredentials
);
commandBus.subscribe(
  RegisterNewUserGoogleCredentialsCommand,
  RegisterNewUserGoogleCredentials
);

commandBus.subscribe(
  RegisterNewUserGithubCredentialsCommand,
  RegisterNewUserGithubCredentials
);
