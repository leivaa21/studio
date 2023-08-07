import { SubscribedCourseInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getSubscribedCourses(
  authorizationToken: string
): Promise<SubscribedCourseInfoResponse[]> {
  const courses = await internalApiClient.get<SubscribedCourseInfoResponse[]>(
    '/api/courses/subscribed',
    undefined,
    authorizationToken
  );

  return courses;
}
