import { DependencyContainer } from '@studio/dependency-injection';
import { MongoCourseRepository } from '../../contexts/courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseRepository } from '../../contexts/courses/domain/CourseRepository';
import { CourseSchemaFactory } from '../../contexts/courses/infrastructure/persistance/mongo/CourseSchemaFactory';
import { MongoCriteriaConverter } from '../../contexts/shared/infrastructure/mongo/MongoCriteriaConverter';
import { LessonRepository } from '../../contexts/lessons/domain/LessonRepository';
import { MongoLessonRepository } from '../../contexts/lessons/infrastructure/persistance/mongo/MongoLessonRepository';
import { LessonSchemaFactory } from '../../contexts/lessons/infrastructure/persistance/mongo/LessonSchemaFactory';

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
