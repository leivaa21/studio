import { internalApiClient } from '../../../lib/InternalApiClient';

export async function unpublishCourse(
  courseId: string,
  authorizationToken: string
) {
  await internalApiClient.put<undefined, void>(
    `/api/course/${courseId}/unpublish`,
    undefined,
    authorizationToken
  );
}
