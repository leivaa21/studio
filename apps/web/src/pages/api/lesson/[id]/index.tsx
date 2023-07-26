import { NextApiRequest, NextApiResponse } from 'next';

import { LessonResponse, UpdateLessonRequest } from '@studio/commons';

import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      await updateLesson(req, res);
      break;
    case 'GET':
      await getLesson(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function getLesson(req: NextApiRequest, res: NextApiResponse) {
  const { id: lessonId } = req.query;

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    const lesson = await coursesApiService.get<LessonResponse>(
      `/lesson/${lessonId}`
    );

    res.status(200).send(lesson);
  });
}

async function updateLesson(req: NextApiRequest, res: NextApiResponse) {
  const { id: lessonId } = req.query;

  const authToken = req.headers.authorization;

  const { body } = req;

  const coursesApiService = new CoursesApiService();

  const request: UpdateLessonRequest = {
    title: body.title,
    content: body.content,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.put<UpdateLessonRequest, void>(
      `/lesson/${lessonId}`,
      request,
      authToken
    );

    res.status(200).end();
  });
}
