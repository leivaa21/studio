import { UpdateCourseTagsRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function updateCourseTags(
  request: UpdateCourseTagsRequest,
  courseId: string,
  authorizationToken: string
) {
  await internalApiClient.put<UpdateCourseTagsRequest, void>(
    `/api/course/${courseId}/tags`,
    request,
    authorizationToken
  );
}
