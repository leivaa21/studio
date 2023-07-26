import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import {
  CreateNewLesson,
  CreateNewLessonCommand,
} from '../../../../contexts/lessons/application/commands/CreateNewLesson';
import {
  UpdateLesson,
  UpdateLessonCommand,
} from '../../../../contexts/lessons/application/commands/UpdateLesson';
import {
  DeleteLesson,
  DeleteLessonCommand,
} from '../../../../contexts/lessons/application/commands/DeleteLesson';

const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

commandBus.subscribe(CreateNewLessonCommand, CreateNewLesson);
commandBus.subscribe(UpdateLessonCommand, UpdateLesson);
commandBus.subscribe(DeleteLessonCommand, DeleteLesson);
