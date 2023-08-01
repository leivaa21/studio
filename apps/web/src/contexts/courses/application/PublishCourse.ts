import { internalApiClient } from '../../../lib/InternalApiClient';

export async function publishCourse(
  courseId: string,
  authorizationToken: string
) {
  await internalApiClient.put<undefined, void>(
    `/api/course/${courseId}/publish`,
    undefined,
    authorizationToken
  );
}
