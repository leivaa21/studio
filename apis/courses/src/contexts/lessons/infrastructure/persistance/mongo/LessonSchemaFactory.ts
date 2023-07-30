import { Injectable } from '@studio/dependency-injection';
import { EntitySchemaFactory } from '../../../../shared/infrastructure/mongo/EntitySchemaFactory';
import { Lesson } from '../../../domain/Lesson';
import { LessonData } from './LessonData';

@Injectable()
export class LessonSchemaFactory
  implements EntitySchemaFactory<LessonData, Lesson>
{
  createSchemaFromEntity(lesson: Lesson): LessonData {
    const { id: _id, ...rest } = lesson.toPrimitives();

    return {
      _id,
      ...rest,
    };
  }
  createEntityFromSchema(schema: LessonData): Lesson {
    return Lesson.fromPrimitives({
      id: schema._id,
      courseId: schema.courseId,
      order: schema.order,
      title: schema.title,
      content: schema.content,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }
}
