import { CreateCourseRequest, CreateCourseResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function createCourse(request: CreateCourseRequest) {
  const response = await internalApiClient.post<
    CreateCourseRequest,
    CreateCourseResponse
  >('/api/courses', request);

  return response;
}
