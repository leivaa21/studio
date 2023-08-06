import { CreateCourseSubscriptionRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function createCourseSubscription(
  request: CreateCourseSubscriptionRequest,
  authorizationToken: string
) {
  await internalApiClient.post<CreateCourseSubscriptionRequest, void>(
    '/api/course-subscriptions',
    request,
    authorizationToken
  );
}
