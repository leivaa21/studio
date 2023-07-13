import { CourseInfoResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getAuthoredCoursesPaginated(
  authorizationToken: string,
  page: number,
  pageSize: number,
  title: string
): Promise<CourseInfoResponse[]> {
  const params = new Map([
    ['page', page.toString()],
    ['pageSize', pageSize.toString()],
    ['title', title],
  ]);

  let courses: CourseInfoResponse[] = [];
  try {
    courses = await internalApiClient.get<CourseInfoResponse[]>(
      '/api/courses/authored',
      params,
      authorizationToken
    );
  } catch (err) {
    console.log(err);
  }

  return courses;
}
