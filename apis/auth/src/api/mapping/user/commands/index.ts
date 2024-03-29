import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
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
import {
  DeleteUser,
  DeleteUserCommand,
} from '../../../../contexts/users/application/commands/DeleteUser';

const commandBus = DependencyContainer.get<CommandBus>(CommandBus);

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

commandBus.subscribe(DeleteUserCommand, DeleteUser);
