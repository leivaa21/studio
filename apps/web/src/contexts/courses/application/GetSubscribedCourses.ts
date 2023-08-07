import { SubscribedCourseInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getSubscribedCourses({
  authorizationToken,
  title,
  tags,
}: {
  authorizationToken: string;
  title?: string;
  tags?: string[];
}): Promise<SubscribedCourseInfoResponse[]> {
  const params = new Map([
    ['title', title || ''],
    ['tags', tags?.join(',') || ''],
  ]);
  const courses = await internalApiClient.get<SubscribedCourseInfoResponse[]>(
    '/api/courses/subscribed',
    params,
    authorizationToken
  );

  return courses;
}
