import { Injectable } from '@studio/dependency-injection';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { CourseRepository } from '../../../domain/CourseRepository';
import { Course } from '../../../domain/Course';
import { CourseModel } from './CourseSchema';
import { CourseData } from './CourseData';
import { CourseSchemaFactory } from './CourseSchemaFactory';
import { CourseCriteria } from '../../../domain/criteria/CourseCriteria';
import { MongoCriteriaConverter } from '../../../../shared/infrastructure/mongo/MongoCriteriaConverter';

@Injectable({ dependencies: [CourseSchemaFactory, MongoCriteriaConverter] })
export class MongoCourseRepository
  extends MongoRepository<CourseData, Course>
  implements CourseRepository
{
  constructor(
    courseSchemaFactory: CourseSchemaFactory,
    private readonly criteriaConverter: MongoCriteriaConverter
  ) {
    super(courseSchemaFactory);
  }

  async matching(criteria: CourseCriteria): Promise<Course[]> {
    const query = this.criteriaConverter.convert(criteria);
    const documents = await this.model()
      .find(query.filter)
      .sort(query.sort)
      .skip(query.skip)
      .limit(query.limit);

    return documents.map((document) =>
      this.entitySchemaFactory.createEntityFromSchema(document)
    );
  }

  protected model() {
    return CourseModel;
  }

  async create(course: Course): Promise<void> {
    await this.persist(course.id.value, course);
  }
}
