import { DependencyContainer } from '@studio/dependency-injection';
import { MongoCourseRepository } from '../../contexts/courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseRepository } from '../../contexts/courses/domain/CourseRepository';
import { CourseSchemaFactory } from '../../contexts/courses/infrastructure/persistance/mongo/CourseSchemaFactory';
import { MongoCriteriaConverter } from '../../contexts/shared/infrastructure/mongo/MongoCriteriaConverter';
import { LessonRepository } from '../../contexts/lessons/domain/LessonRepository';
import { MongoLessonRepository } from '../../contexts/lessons/infrastructure/persistance/mongo/MongoLessonRepository';
import { LessonSchemaFactory } from '../../contexts/lessons/infrastructure/persistance/mongo/LessonSchemaFactory';
import { CourseSubscriptionSchemaFactory } from '../../contexts/course-subscriptions/infrastructure/persistance/mongo/CourseSubscriptionSchemaFactory';
import { CourseSubscriptionRepository } from '../../contexts/course-subscriptions/domain/CourseSubscriptionRepository';
import { MongoCourseSubscriptionRepository } from '../../contexts/course-subscriptions/infrastructure/persistance/mongo/MongoCourseSubscriptionRepository';
import { CourseStatsRepository } from '../../contexts/course-stats/domain/CourseStatsRepository';
import { MongoCourseStatsRepository } from '../../contexts/course-stats/infrastructure/persistance/mongo/MongoCourseStatsRepository';
import { CourseStatsSchemaFactory } from '../../contexts/course-stats/infrastructure/persistance/mongo/CourseStatsSchemaFactory';

const courseSchemaFactory = new CourseSchemaFactory();
const criteriaConverter = new MongoCriteriaConverter();

DependencyContainer.registerImplementation({
  constructor: CourseRepository,
  implementation: new MongoCourseRepository(
    courseSchemaFactory,
    criteriaConverter
  ),
});

const lessonSchemaFactory = new LessonSchemaFactory();

DependencyContainer.registerImplementation({
  constructor: LessonRepository,
  implementation: new MongoLessonRepository(lessonSchemaFactory),
});

const courseSubscriptionSchemaFactory = new CourseSubscriptionSchemaFactory();

DependencyContainer.registerImplementation({
  constructor: CourseSubscriptionRepository,
  implementation: new MongoCourseSubscriptionRepository(
    courseSubscriptionSchemaFactory
  ),
});

const courseStatsSchemaFactory = new CourseStatsSchemaFactory();

DependencyContainer.registerImplementation({
  constructor: CourseStatsRepository,
  implementation: new MongoCourseStatsRepository(courseStatsSchemaFactory),
});
