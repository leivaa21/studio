import { CheckIfUserIsSubscribedToCourseResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function checkIfUserIsSubscribedToCourse(
  courseId: string,
  authorizationToken: string
): Promise<boolean> {
  const { isSubscribed } =
    await internalApiClient.get<CheckIfUserIsSubscribedToCourseResponse>(
      `/api/course-subscription/${courseId}/check`,
      undefined,
      authorizationToken
    );

  return isSubscribed;
}
