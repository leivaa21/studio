import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import {
  CreateCourseSubscription,
  CreateCourseSubscriptionCommand,
} from '../../../../contexts/course-subscriptions/application/commands/CreateCourseSubscription';
import {
  DeleteCourseSubscription,
  DeleteCourseSubscriptionCommand,
} from '../../../../contexts/course-subscriptions/application/commands/DeleteCourseSubscription';
import {
  MarkLessonAsCompleted,
  MarkLessonAsCompletedCommand,
} from '../../../../contexts/course-subscriptions/application/commands/MarkLessonAsCompleted';

const commandBus = DependencyContainer.get<CommandBus>(CommandBus);

commandBus.subscribe(CreateCourseSubscriptionCommand, CreateCourseSubscription);
commandBus.subscribe(DeleteCourseSubscriptionCommand, DeleteCourseSubscription);
commandBus.subscribe(MarkLessonAsCompletedCommand, MarkLessonAsCompleted);
