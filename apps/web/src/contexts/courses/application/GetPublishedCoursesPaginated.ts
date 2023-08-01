import { CourseInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getPublishedCoursesPaginated(
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
    '/api/courses',
    params
  );

  return courses;
}
