import { UpdateLessonRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function updateLesson(
  request: UpdateLessonRequest,
  lessonId: string,
  authorizationToken: string
) {
  await internalApiClient.put<UpdateLessonRequest, void>(
    `/api/lesson/${lessonId}`,
    request,
    authorizationToken
  );
}
