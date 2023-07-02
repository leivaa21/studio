import { CreateCourseResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export interface CreateCourseRequest {
  title: string;
  description: string;
}

export async function createCourse(request: CreateCourseRequest) {
  const response = await internalApiClient.post<
    CreateCourseRequest,
    CreateCourseResponse
  >('/api/courses', request);

  return response;
}
