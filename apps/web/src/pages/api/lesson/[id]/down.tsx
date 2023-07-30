import { NextApiRequest, NextApiResponse } from 'next';

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
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function updateLesson(req: NextApiRequest, res: NextApiResponse) {
  const { id: lessonId } = req.query;

  const authToken = req.headers.authorization;

  const coursesApiService = new CoursesApiService();

  await SafeControllerHandling(res, async () => {
    await coursesApiService.put<undefined, void>(
      `/lesson/${lessonId}/down`,
      undefined,
      authToken
    );

    res.status(200).end();
  });
}
