import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { Course } from '../../../domain/Course';
import { CourseData } from './CourseData';

@Injectable()
export class CourseSchemaFactory
  implements EntitySchemaFactory<CourseData, Course>
{
  createSchemaFromEntity(course: Course): CourseData {
    const { id: _id, ...rest } = course.toPrimitives();

    return {
      _id,
      ...rest,
    };
  }
  createEntityFromSchema(schema: CourseData): Course {
    return Course.fromPrimitives({
      id: schema._id,
      authorId: schema.authorId,
      title: schema.title,
      description: schema.description,
      createdAt: schema.createdAt,
    });
  }
}
