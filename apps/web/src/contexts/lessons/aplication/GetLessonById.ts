import { LessonResponse } from '@studio/commons';
import { internalApiClient } from '../../../lib/InternalApiClient';

export async function getLessonById(lessonId: string): Promise<LessonResponse> {
  const lesson = await internalApiClient.get<LessonResponse>(
    `/api/lesson/${lessonId}`
  );

  return lesson;
}
