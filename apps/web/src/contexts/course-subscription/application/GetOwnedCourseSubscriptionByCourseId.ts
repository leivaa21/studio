import { CourseSubscriptionInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getOwnedCourseSubscriptionByCourseId(
  courseId: string,
  authorizationToken: string
): Promise<CourseSubscriptionInfoResponse> {
  return internalApiClient.get<CourseSubscriptionInfoResponse>(
    `/api/course-subscription/by-course/${courseId}`,
    undefined,
    authorizationToken
  );
}
