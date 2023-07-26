import { internalApiClient } from '../../../lib/InternalApiClient';

export async function deleteLesson(
  lessonId: string,
  authorizationToken: string
) {
  await internalApiClient.delete<undefined, void>(
    `/api/lesson/${lessonId}`,
    undefined,
    authorizationToken
  );
}
