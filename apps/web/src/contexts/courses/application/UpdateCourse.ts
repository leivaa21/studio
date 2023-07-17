import { UpdateCourseRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function updateCourse(
  request: UpdateCourseRequest,
  courseId: string,
  authorizationToken: string
) {
  await internalApiClient.put<UpdateCourseRequest, void>(
    `/api/course/${courseId}`,
    request,
    authorizationToken
  );
}
