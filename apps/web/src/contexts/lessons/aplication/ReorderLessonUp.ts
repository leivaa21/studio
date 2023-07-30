import { internalApiClient } from '../../../lib/InternalApiClient';

export async function reorderLessonUp(
  lessonId: string,
  authorizationToken: string
) {
  await internalApiClient.put<undefined, void>(
    `/api/lesson/${lessonId}/up`,
    undefined,
    authorizationToken
  );
}
