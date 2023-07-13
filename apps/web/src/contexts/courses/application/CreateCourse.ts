import { CreateCourseRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function createCourse(
  request: CreateCourseRequest,
  authorizationToken: string
) {
  await internalApiClient.post<CreateCourseRequest, void>(
    '/api/courses',
    request,
    authorizationToken
  );
}
