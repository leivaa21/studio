import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import {
  CreateNewLesson,
  CreateNewLessonCommand,
} from '../../../../contexts/lessons/application/commands/CreateNewLesson';

const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

commandBus.subscribe(CreateNewLessonCommand, CreateNewLesson);
