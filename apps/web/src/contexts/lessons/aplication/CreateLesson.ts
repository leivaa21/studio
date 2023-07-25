import { CreateLessonRequest } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function createLesson(
  request: CreateLessonRequest,
  authorizationToken: string
) {
  await internalApiClient.post<CreateLessonRequest, void>(
    '/api/lessons',
    request,
    authorizationToken
  );
}
