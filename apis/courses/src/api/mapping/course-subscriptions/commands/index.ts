import { DependencyContainer } from '@studio/dependency-injection';
import { CommandBus } from '../../../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import {
  CreateCourseSubscription,
  CreateCourseSubscriptionCommand,
} from '../../../../contexts/course-subscriptions/application/commands/CreateCourseSubscription';

const commandBus = DependencyContainer.get<CommandBus>(InMemoryCommandBus);

commandBus.subscribe(CreateCourseSubscriptionCommand, CreateCourseSubscription);
