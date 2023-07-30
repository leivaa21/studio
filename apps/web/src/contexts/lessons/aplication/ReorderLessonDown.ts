import { internalApiClient } from '../../../lib/InternalApiClient';

export async function reorderLessonDown(
  lessonId: string,
  authorizationToken: string
) {
  await internalApiClient.put<undefined, void>(
    `/api/lesson/${lessonId}/down`,
    undefined,
    authorizationToken
  );
}
