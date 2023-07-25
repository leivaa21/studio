import { UpdateCourseDescriptionRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function updateCourseDescription(
  request: UpdateCourseDescriptionRequest,
  courseId: string,
  authorizationToken: string
) {
  await internalApiClient.put<UpdateCourseDescriptionRequest, void>(
    `/api/course/${courseId}/description`,
    request,
    authorizationToken
  );
}
