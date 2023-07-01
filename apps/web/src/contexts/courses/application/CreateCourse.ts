import { internalApiClient } from '../../../lib/InternalApiClient';

export interface CreateCourseRequest {
  title: string;
  description: string;
}

export async function createCourse(request: CreateCourseRequest) {
  await internalApiClient.post('', request);
}
