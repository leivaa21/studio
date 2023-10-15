import { DependencyContainer } from '@studio/dependency-injection';
import { MongoCourseRepository } from '../../contexts/courses/infrastructure/persistance/mongo/MongoCourseRepository';
import { CourseRepository } from '../../contexts/courses/domain/CourseRepository';
import { CourseSchemaFactory } from '../../contexts/courses/infrastructure/persistance/mongo/CourseSchemaFactory';
import { MongoCriteriaConverter } from '../../contexts/shared/infrastructure/mongo/MongoCriteriaConverter';

const courseSchemaFactory = new CourseSchemaFactory();
const criteriaConverter = new MongoCriteriaConverter();

DependencyContainer.registerImplementation({
  constructor: CourseRepository,
  implementation: new MongoCourseRepository(
    courseSchemaFactory,
    criteriaConverter
  ),
});
