import { AuthorId } from '../../../../src/contexts/courses/domain/AuthorId';
import { Course } from '../../../../src/contexts/courses/domain/Course';
import { CourseId } from '../../../../src/contexts/courses/domain/CourseId';
import { CourseModel } from '../../../../src/contexts/courses/infrastructure/persistance/mongo/CourseSchema';
import { CourseSchemaFactory } from '../../../../src/contexts/courses/infrastructure/persistance/mongo/CourseSchemaFactory';

const schemaFactory = new CourseSchemaFactory();

export async function createCourse(course: Course): Promise<void> {
  const document = schemaFactory.createSchemaFromEntity(course);
  await CourseModel.create(document);
}

export async function findCourseById(
  id: CourseId
): Promise<Course | undefined> {
  const document = await CourseModel.findById(id.value);

  return document ? schemaFactory.createEntityFromSchema(document) : undefined;
}

export async function findCoursesByAuthorId(
  authorId: AuthorId
): Promise<Course[] | undefined> {
  const documents = await CourseModel.find({ authorId: authorId.value });

  return documents
    ? documents.map((document) =>
        schemaFactory.createEntityFromSchema(document)
      )
    : undefined;
}
