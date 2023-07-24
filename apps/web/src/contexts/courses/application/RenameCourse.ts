import { RenameCourseRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function renameCourse(
  request: RenameCourseRequest,
  courseId: string,
  authorizationToken: string
) {
  await internalApiClient.put<RenameCourseRequest, void>(
    `/api/course/${courseId}/title`,
    request,
    authorizationToken
  );
}
