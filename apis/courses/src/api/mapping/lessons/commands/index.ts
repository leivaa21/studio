import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
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
import {
  ReorderLessonUp,
  ReorderLessonUpCommand,
} from '../../../../contexts/lessons/application/commands/ReorderLessonUp';
import {
  ReorderLessonDown,
  ReorderLessonDownCommand,
} from '../../../../contexts/lessons/application/commands/ReorderLessonDown';

const commandBus = DependencyContainer.get<CommandBus>(CommandBus);

commandBus.subscribe(CreateNewLessonCommand, CreateNewLesson);
commandBus.subscribe(UpdateLessonCommand, UpdateLesson);
commandBus.subscribe(DeleteLessonCommand, DeleteLesson);
commandBus.subscribe(ReorderLessonUpCommand, ReorderLessonUp);
commandBus.subscribe(ReorderLessonDownCommand, ReorderLessonDown);
