import { Injectable } from '@studio/dependency-injection';
import { MongoRepository } from '../../../../shared/infrastructure/mongo/MongoRepository';
import { LessonRepository } from '../../../domain/LessonRepository';
import { LessonData } from './LessonData';
import { Lesson } from '../../../domain/Lesson';
import { LessonSchemaFactory } from './LessonSchemaFactory';
import { LessonModel } from './LessonSchema';

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
}
