import { Injectable } from '@studio/dependency-injection';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { CourseRepository } from '../../../domain/CourseRepository';
import { Course } from '../../../domain/Course';
import { CourseModel } from './CourseSchema';
import { CourseData } from './CourseData';
import { CourseSchemaFactory } from './CourseSchemaFactory';

@Injectable({ dependencies: [CourseSchemaFactory] })
export class MongoCourseRepository
  extends MongoRepository<CourseData, Course>
  implements CourseRepository
{
  protected model() {
    return CourseModel;
  }

  async create(course: Course): Promise<void> {
    await this.persist(course.id.value, course);
  }
}
