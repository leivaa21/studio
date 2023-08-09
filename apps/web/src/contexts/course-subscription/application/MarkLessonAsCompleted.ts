import { internalApiClient } from '../../../lib/InternalApiClient';

export async function markLessonAsCompleted(
  lessonId: string,
  authorizationToken: string
): Promise<void> {
  await internalApiClient.put<undefined, undefined>(
    `/api/course-subscription/complete-lesson/${lessonId}`,
    undefined,
    authorizationToken
  );
}
