import { CreateCourseRequest, CreateCourseResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function createCourse(
  request: CreateCourseRequest,
  authorizationToken: string
) {
  const response = await internalApiClient.post<
    CreateCourseRequest,
    CreateCourseResponse
  >('/api/courses', request, authorizationToken);

  return response;
}
