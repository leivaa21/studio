import { LessonInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getLessonsByCourseId(
  courseId: string
): Promise<LessonInfoResponse[]> {
  const lessons = await internalApiClient.get<LessonInfoResponse[]>(
    `/api/lessons/by-course/${courseId}`
  );

  return lessons;
}
