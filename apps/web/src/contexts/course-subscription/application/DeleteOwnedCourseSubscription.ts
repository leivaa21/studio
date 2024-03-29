import { internalApiClient } from '../../../lib/InternalApiClient';

export async function deleteOwnedCourseSubscription(
  id: string,
  authorizationToken: string
): Promise<void> {
  await internalApiClient.delete<undefined, undefined>(
    `/api/course-subscription/${id}`,
    undefined,
    authorizationToken
  );
}
