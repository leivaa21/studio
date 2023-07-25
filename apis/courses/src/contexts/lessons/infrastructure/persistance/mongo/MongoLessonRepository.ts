import { Injectable } from '@studio/dependency-injection';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { LessonRepository } from '../../../domain/LessonRepository';
import { LessonData } from './LessonData';
import { Lesson } from '../../../domain/Lesson';
import { LessonSchemaFactory } from './LessonSchemaFactory';
import { LessonModel } from './LessonSchema';
import { CourseId } from '../../../../courses/domain/CourseId';

@Injectable({ dependencies: [LessonSchemaFactory] })
export class MongoLessonRepository
  extends MongoRepository<LessonData, Lesson>
  implements LessonRepository
{
  constructor(lessonSchemaFactory: LessonSchemaFactory) {
    super(lessonSchemaFactory);
  }

  protected model() {
    return LessonModel;
  }

  public async create(lesson: Lesson): Promise<void> {
    await this.persist(lesson.id.value, lesson);
  }

  public async findByCourseId(courseId: CourseId): Promise<Lesson[]> {
    const documents = await this.model().find({ courseId: courseId.value });

    return documents.map((document) =>
      this.entitySchemaFactory.createEntityFromSchema(document)
    );
  }
}
