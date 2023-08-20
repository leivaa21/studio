import { CourseInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getAuthoredCoursesFiltered(
  authorizationToken: string,
  title: string,
  tags: string[]
): Promise<CourseInfoResponse[]> {
  const params = new Map([
    ['title', title],
    ['tags', tags.join(',')],
  ]);

  const courses = await internalApiClient.get<CourseInfoResponse[]>(
    '/api/courses/authored',
    params,
    authorizationToken
  );

  return courses;
}
