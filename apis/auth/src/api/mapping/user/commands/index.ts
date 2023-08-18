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
import {
  RenameUser,
  RenameUserCommand,
} from '../../../../contexts/users/application/commands/RenameUser';
import {
  ChangeEmail,
  ChangeEmailCommand,
} from '../../../../contexts/users/application/commands/ChangeEmail';
import {
  ChangePassword,
  ChangePasswordCommand,
} from '../../../../contexts/users/application/commands/ChangePassword';

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

commandBus.subscribe(RenameUserCommand, RenameUser);
commandBus.subscribe(ChangeEmailCommand, ChangeEmail);
commandBus.subscribe(ChangePasswordCommand, ChangePassword);
