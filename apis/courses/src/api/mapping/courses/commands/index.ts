import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import {
  CreateNewCourse,
  CreateNewCourseCommand,
} from '../../../../contexts/courses/application/commands/CreateNewCourse';

const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

commandBus.subscribe(CreateNewCourseCommand, CreateNewCourse);
