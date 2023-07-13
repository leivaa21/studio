import { CourseInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getAuthoredCoursesPaginated(
  authorizationToken: string,
  page: number,
  pageSize: number,
  title: string,
  tags: string[]
): Promise<CourseInfoResponse[]> {
  const params = new Map([
    ['page', page.toString()],
    ['pageSize', pageSize.toString()],
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
