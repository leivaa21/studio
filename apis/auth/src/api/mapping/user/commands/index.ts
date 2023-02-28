import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import {
  RegisterNewUserBasicCredentialsCommand,
  RegisterNewUserBasicCredentials,
} from '../../../../contexts/users/application/commands/RegisterNewUser/RegisterNewUserBasicCredentials';

const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

commandBus.subscribe(
  RegisterNewUserBasicCredentialsCommand,
  RegisterNewUserBasicCredentials
);
