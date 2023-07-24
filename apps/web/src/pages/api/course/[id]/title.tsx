import { NextApiRequest, NextApiResponse } from 'next';

import { RenameCourseRequest } from '@studio/commons';

import { SafeControllerHandling } from '../../../../lib/controllers/SafeControllerHandling';
import { CoursesApiService } from '../../../../contexts/shared/infrastructure/ApiClients/CoursesApiService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case 'PUT':
      await renameCourse(req, res);
      break;
    default:
      return res
        .status(404)
        .json({ status: 404, message: `Cannot ${req.method} ${req.url}` });
  }
}

async function renameCourse(req: NextApiRequest, res: NextApiResponse) {
  const { id: courseId } = req.query;

  const authToken = req.headers.authorization;

  const { body } = req;

  const coursesApiService = new CoursesApiService();

  const request: RenameCourseRequest = {
    title: body.title,
  };

  await SafeControllerHandling(res, async () => {
    await coursesApiService.put<RenameCourseRequest, void>(
      `/course/${courseId}/title`,
      request,
      authToken
    );

    res.status(200).end();
  });
}
