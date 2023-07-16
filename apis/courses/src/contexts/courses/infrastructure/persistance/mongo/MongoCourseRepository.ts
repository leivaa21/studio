import { Injectable } from '@studio/dependency-injection';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { CourseRepository } from '../../../domain/CourseRepository';
import { Course } from '../../../domain/Course';
import { CourseModel } from './CourseSchema';
import { CourseData } from './CourseData';
import { CourseSchemaFactory } from './CourseSchemaFactory';
import { CourseCriteria } from '../../../domain/criteria/CourseCriteria';
import { MongoCriteriaConverter } from '../../../../shared/infrastructure/mongo/MongoCriteriaConverter';
import { Nullable } from '../../../../shared/domain/Nullable';
import { CourseId } from '../../../domain/CourseId';

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

  protected model() {
    return CourseModel;
  }

  public async matching(criteria: CourseCriteria): Promise<Course[]> {
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

  public async create(course: Course): Promise<void> {
    await this.persist(course.id.value, course);
  }

  public async findById(id: CourseId): Promise<Nullable<Course>> {
    const document = await this.model().findById(id.value);

    return document
      ? this.entitySchemaFactory.createEntityFromSchema(document)
      : null;
  }

  public async update(course: Course): Promise<void> {
    const document = this.entitySchemaFactory.createSchemaFromEntity(course);
    await this.model().findByIdAndUpdate(document._id, document);
  }
}
