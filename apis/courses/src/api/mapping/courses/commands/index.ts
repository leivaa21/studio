import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import {
  CreateNewCourse,
  CreateNewCourseCommand,
} from '../../../../contexts/courses/application/commands/CreateNewCourse';
import {
  RenameCourse,
  RenameCourseCommand,
} from '../../../../contexts/courses/application/commands/RenameCourse';
import {
  UpdateCourseDescription,
  UpdateCourseDescriptionCommand,
} from '../../../../contexts/courses/application/commands/UpdateCourseDescription';
import {
  UpdateCourseTags,
  UpdateCourseTagsCommand,
} from '../../../../contexts/courses/application/commands/UpdateCourseTags';
import {
  PublishCourse,
  PublishCourseCommand,
} from '../../../../contexts/courses/application/commands/PublishCourse';
import {
  UnpublishCourse,
  UnpublishCourseCommand,
} from '../../../../contexts/courses/application/commands/UnpublishCourse';

const commandBus = DependencyContainer.get<CommandBus>(CommandBus);

commandBus.subscribe(CreateNewCourseCommand, CreateNewCourse);
commandBus.subscribe(RenameCourseCommand, RenameCourse);
commandBus.subscribe(UpdateCourseDescriptionCommand, UpdateCourseDescription);
commandBus.subscribe(UpdateCourseTagsCommand, UpdateCourseTags);
commandBus.subscribe(PublishCourseCommand, PublishCourse);
commandBus.subscribe(UnpublishCourseCommand, UnpublishCourse);
