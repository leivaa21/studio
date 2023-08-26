import { CourseStatsModel } from '../../../../src/contexts/course-stats/infrastructure/persistance/mongo/CourseStatsSchema';
import { CourseStats } from '../../../../src/contexts/course-stats/domain/CourseStats';
import { CourseStatsSchemaFactory } from '../../../../src/contexts/course-stats/infrastructure/persistance/mongo/CourseStatsSchemaFactory';
import { CourseId } from '../../../../src/contexts/courses/domain/CourseId';

const schemaFactory = new CourseStatsSchemaFactory();

export async function createCourseStats(
  courseStats: CourseStats
): Promise<void> {
  const document = schemaFactory.createSchemaFromEntity(courseStats);
  await CourseStatsModel.create(document);
}

export async function findCourseStats(
  courseId: CourseId
): Promise<CourseStats | undefined> {
  const document = await CourseStatsModel.findOne({
    courseId: courseId.value,
  });

  return document ? schemaFactory.createEntityFromSchema(document) : undefined;
}
