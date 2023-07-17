import { CourseInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getCourseById(
  courseId: string
): Promise<CourseInfoResponse> {
  const course = await internalApiClient.get<CourseInfoResponse>(
    `/api/course/${courseId}`
  );

  return course;
}
