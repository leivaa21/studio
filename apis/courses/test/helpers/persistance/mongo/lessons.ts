import { CourseId } from '../../../../src/contexts/courses/domain/CourseId';
import { Lesson } from '../../../../src/contexts/lessons/domain/Lesson';
import { LessonId } from '../../../../src/contexts/lessons/domain/LessonId';
import { LessonModel } from '../../../../src/contexts/lessons/infrastructure/persistance/mongo/LessonSchema';
import { LessonSchemaFactory } from '../../../../src/contexts/lessons/infrastructure/persistance/mongo/LessonSchemaFactory';

const schemaFactory = new LessonSchemaFactory();

export async function createLesson(lesson: Lesson): Promise<void> {
  const document = schemaFactory.createSchemaFromEntity(lesson);
  await LessonModel.create(document);
}

export async function findLessonById(
  id: LessonId
): Promise<Lesson | undefined> {
  const document = await LessonModel.findById(id.value);

  return document ? schemaFactory.createEntityFromSchema(document) : undefined;
}

export async function findLessonsByCourseId(
  courseId: CourseId
): Promise<Lesson[] | undefined> {
  const documents = await LessonModel.find({ courseId: courseId.value });

  return documents
    ? documents.map((document) =>
        schemaFactory.createEntityFromSchema(document)
      )
    : undefined;
}
