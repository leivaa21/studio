import { DependencyContainer } from '@studio/dependency-injection';
import { UserRepository } from '../../contexts/users/domain/UserRepository';
import { MongoUserRepository } from '../../contexts/users/infrastructure/persistance/mongo/MongoUserRepository';
import { UserSchemaFactory } from '../../contexts/users/infrastructure/persistance/mongo/UserSchemaFactory';
import { CommandBus } from '../../contexts/shared/domain/CommandBus';
import { InMemoryCommandBus } from '../../contexts/shared/infrastructure/CommandBus/InMemoryCommandBus';
import { QueryBus } from '../../contexts/shared/domain/QueryBus';
import { InMemoryQueryBus } from '../../contexts/shared/infrastructure/QueryBus/InMemoryQueryBus';
import { EventBus } from '../../contexts/shared/domain/EventBus';
import { RabbitMQEventBus } from '../../contexts/shared/infrastructure/EventBus/RabbitMQEventBus';

const userSchemaFactory = new UserSchemaFactory();

DependencyContainer.registerImplementation({
  constructor: UserRepository,
  implementation: new MongoUserRepository(userSchemaFactory),
});

DependencyContainer.registerImplementation({
  constructor: CommandBus,
  implementation: new InMemoryCommandBus(),
});

DependencyContainer.registerImplementation({
  constructor: QueryBus,
  implementation: new InMemoryQueryBus(),
});

DependencyContainer.registerImplementation({
  constructor: EventBus,
  implementation: new RabbitMQEventBus(),
});
