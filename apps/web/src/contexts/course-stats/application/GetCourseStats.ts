import { CurrentCourseStatsResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getCourseStats(
  courseId: string
): Promise<CurrentCourseStatsResponse> {
  const course = await internalApiClient.get<CurrentCourseStatsResponse>(
    `/api/course-stats/${courseId}`
  );

  return course;
}
